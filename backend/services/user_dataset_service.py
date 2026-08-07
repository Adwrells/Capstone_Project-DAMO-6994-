"""
Healthcare Analytics Platform - User Dataset Persistence

Persists a web user's cleaned dataset into SQLite so that Explorer, Dashboard and Reports
can read it back from the database rather than only from React state.

Isolation is the point. Each upload lands in its **own namespaced table**
(`user_dataset_<id>`), never in the six seeded analytical tables. The H1-H5 cohort stays
byte-for-byte reproducible no matter how many datasets users upload — see architecture.md
§4A on why Path A must not mutate Path B.

The registry table is created lazily here rather than declared in `schema.sql`, because
`schema.sql` drops and recreates its tables: putting the registry there would make every
`load_csv` rebuild silently destroy user uploads.
"""

import re
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

try:
    from backend.database.database_manager import db_manager
except ImportError:
    from database.database_manager import db_manager

REGISTRY_TABLE = "user_datasets"
TABLE_PREFIX = "user_dataset_"

# Guards against a pathological upload exhausting the database or the response payload.
MAX_COLUMNS = 200
MAX_ROWS = 100_000
DEFAULT_ROW_LIMIT = 1000
MAX_ROW_LIMIT = 10_000

# Column names are rewritten to this shape before they reach DDL.
SAFE_IDENTIFIER = re.compile(r"[^0-9a-zA-Z_]")

REGISTRY_DDL = f"""
CREATE TABLE IF NOT EXISTS {REGISTRY_TABLE} (
    dataset_id    TEXT PRIMARY KEY,
    table_name    TEXT NOT NULL UNIQUE,
    display_name  TEXT NOT NULL,
    row_count     INTEGER NOT NULL DEFAULT 0,
    column_count  INTEGER NOT NULL DEFAULT 0,
    quality_score REAL,
    created_at    TEXT NOT NULL
)
"""


def sanitize_column(name: Any, position: int) -> str:
    """Rewrites an arbitrary key into a safe SQL identifier.

    Column names come from a user's spreadsheet headers and cannot be bound as parameters,
    so they are rewritten rather than validated: anything outside [0-9a-zA-Z_] is replaced,
    a leading digit is prefixed, and an empty result falls back to a positional name.
    """
    cleaned = SAFE_IDENTIFIER.sub("_", str(name).strip())
    if not cleaned or cleaned.strip("_") == "":
        return f"column_{position}"
    if cleaned[0].isdigit():
        cleaned = f"col_{cleaned}"
    return cleaned[:64]


def infer_sql_type(values: List[Any]) -> str:
    """INTEGER / REAL / TEXT from the observed non-null values."""
    seen_number = False
    for value in values:
        if value is None or value == "":
            continue
        if isinstance(value, bool):
            return "TEXT"
        if isinstance(value, int):
            seen_number = True
            continue
        if isinstance(value, float):
            return "REAL"
        try:
            float(str(value).replace(",", ""))
            return "REAL"
        except ValueError:
            return "TEXT"
    return "INTEGER" if seen_number else "TEXT"


def build_schema(records: List[Dict[str, Any]]) -> Dict[str, str]:
    """Ordered {safe_column: sql_type} derived from the record keys."""
    if not records:
        return {}

    keys = list(records[0].keys())[:MAX_COLUMNS]
    schema: Dict[str, str] = {}

    for position, key in enumerate(keys):
        column = sanitize_column(key, position)
        # A collision after sanitising ("A/B" and "A-B" both become "A_B") must not
        # produce duplicate DDL columns.
        if column in schema:
            column = f"{column}_{position}"
        schema[column] = infer_sql_type([row.get(key) for row in records[:200]])

    return schema


class UserDatasetService:
    """Stores and retrieves user-cleaned datasets in isolated tables."""

    @staticmethod
    def _ensure_registry(manager: Optional[Any] = None) -> None:
        (manager or db_manager).execute_script(REGISTRY_DDL)

    @staticmethod
    def persist(
        records: List[Dict[str, Any]],
        display_name: str = "Cleaned Dataset",
        quality_score: Optional[float] = None,
        manager: Optional[Any] = None,
    ) -> Dict[str, Any]:
        """Writes cleaned records to a new isolated table and registers it.

        Returns the registry entry. Raises ValueError on empty input rather than creating
        an empty table nobody can use.
        """
        db = manager or db_manager

        if not records:
            raise ValueError("No records to persist.")

        schema = build_schema(records)
        if not schema:
            raise ValueError("Records contain no usable columns.")

        dataset_id = uuid.uuid4().hex[:12]
        table_name = f"{TABLE_PREFIX}{dataset_id}"
        source_keys = list(records[0].keys())[: len(schema)]
        columns = list(schema)

        UserDatasetService._ensure_registry(db)

        column_ddl = ", ".join(f'"{c}" {t}' for c, t in schema.items())
        db.execute_script(f'CREATE TABLE "{table_name}" ({column_ddl})')

        placeholders = ", ".join("?" * len(columns))
        column_list = ", ".join(f'"{c}"' for c in columns)
        insert_sql = f'INSERT INTO "{table_name}" ({column_list}) VALUES ({placeholders})'

        rows = [
            tuple(
                None if row.get(key) == "" else row.get(key)
                for key in source_keys
            )
            for row in records[:MAX_ROWS]
        ]

        with db.connection() as conn:
            conn.executemany(insert_sql, rows)
            conn.execute(
                f"INSERT INTO {REGISTRY_TABLE} "
                "(dataset_id, table_name, display_name, row_count, column_count, quality_score, created_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    dataset_id,
                    table_name,
                    str(display_name)[:200],
                    len(rows),
                    len(columns),
                    quality_score,
                    datetime.now().isoformat(),
                ),
            )
            conn.commit()

        return {
            "dataset_id": dataset_id,
            "table_name": table_name,
            "display_name": str(display_name)[:200],
            "row_count": len(rows),
            "column_count": len(columns),
            "quality_score": quality_score,
        }

    @staticmethod
    def list_datasets(manager: Optional[Any] = None) -> List[Dict[str, Any]]:
        """Registry entries, newest first."""
        db = manager or db_manager
        UserDatasetService._ensure_registry(db)
        return db.execute_query(
            f"SELECT * FROM {REGISTRY_TABLE} ORDER BY created_at DESC"
        )

    @staticmethod
    def get_records(
        dataset_id: str,
        limit: int = DEFAULT_ROW_LIMIT,
        manager: Optional[Any] = None,
    ) -> Optional[Dict[str, Any]]:
        """Rows for one persisted dataset, or None when the id is unknown.

        The table name is read from the registry rather than built from the caller's input,
        so an arbitrary identifier can never reach the query.
        """
        db = manager or db_manager
        UserDatasetService._ensure_registry(db)

        entry = db.execute_query(
            f"SELECT * FROM {REGISTRY_TABLE} WHERE dataset_id = ?", (str(dataset_id),)
        )
        if not entry:
            return None

        table_name = entry[0]["table_name"]
        try:
            safe_limit = min(max(int(limit), 1), MAX_ROW_LIMIT)
        except (TypeError, ValueError):
            safe_limit = DEFAULT_ROW_LIMIT

        rows = db.execute_query(f'SELECT * FROM "{table_name}" LIMIT {safe_limit}')
        return {**entry[0], "data": rows, "returned_rows": len(rows)}

    @staticmethod
    def delete_dataset(dataset_id: str, manager: Optional[Any] = None) -> bool:
        """Drops a persisted dataset and its registry row. False when the id is unknown."""
        db = manager or db_manager
        UserDatasetService._ensure_registry(db)

        entry = db.execute_query(
            f"SELECT table_name FROM {REGISTRY_TABLE} WHERE dataset_id = ?", (str(dataset_id),)
        )
        if not entry:
            return False

        with db.connection() as conn:
            conn.execute(f'DROP TABLE IF EXISTS "{entry[0]["table_name"]}"')
            conn.execute(f"DELETE FROM {REGISTRY_TABLE} WHERE dataset_id = ?", (str(dataset_id),))
            conn.commit()
        return True


user_dataset_service = UserDatasetService()
