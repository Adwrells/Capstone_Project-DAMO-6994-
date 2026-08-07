"""
Healthcare Analytics Platform - Dataset Access Service Layer

Owns table listing and row retrieval that previously sat inline in backend/api/datasets.py.
See architecture.md §1 principle 3 and the C2 conformance check in §4C.
"""

from typing import Any, Dict, List, Optional

try:
    from backend.database.database_manager import db_manager
except ImportError:
    from database.database_manager import db_manager

DEFAULT_ROW_LIMIT = 1000
MAX_ROW_LIMIT = 10000


def _safe_limit(limit: Any) -> int:
    """Coerces a row limit to a sane positive integer.

    The limit is interpolated into the SQL string (LIMIT cannot be a bound parameter in
    every SQLite driver path used here), so it must never reach the query as free text.
    A malformed value falls back to the default rather than raising — a bad query string
    should not surface as a 500.
    """
    try:
        value = int(limit)
    except (TypeError, ValueError):
        return DEFAULT_ROW_LIMIT
    if value <= 0:
        return DEFAULT_ROW_LIMIT
    return min(value, MAX_ROW_LIMIT)


class DatasetService:
    """Reads dataset tables from the analytical database."""

    @staticmethod
    def list_datasets(manager: Optional[Any] = None) -> List[str]:
        """Names of every table available for exploration."""
        db = manager or db_manager
        return db.get_tables()

    @staticmethod
    def get_records(
        dataset_name: str,
        limit: int = DEFAULT_ROW_LIMIT,
        manager: Optional[Any] = None,
    ) -> Optional[Dict[str, Any]]:
        """Rows for one dataset table, or None when the table does not exist.

        The name is checked against the live table list before it reaches the query. That
        allow-list is the guard: a table name cannot be bound as a SQL parameter, so
        validating against `get_tables()` is what keeps arbitrary identifiers out of the
        statement. Returning None rather than raising keeps HTTP concerns in the router.
        """
        db = manager or db_manager

        if dataset_name not in db.get_tables():
            return None

        rows = db.execute_query(f'SELECT * FROM "{dataset_name}" LIMIT {_safe_limit(limit)}')
        return {
            "dataset_name": dataset_name,
            "row_count": len(rows),
            "data": rows,
        }


dataset_service = DatasetService()
