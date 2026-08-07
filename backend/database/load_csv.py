"""
Healthcare Analytics Platform - Analytical Database Loader

Rebuilds backend/database/healthcare.db from the CLEANED datasets, making the analytical
store reproducible from source rather than a committed binary.

Source priority
---------------
1. ``data/cleaned dataset/Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx`` — the
   master workbook produced by the cleaning notebooks. Preferred: it is the only source
   that carries all six datasets, including ``Age_Sex``.
2. ``data/Explorer Dataset/*.csv`` — per-dataset CSV exports. Fallback only; this folder
   has no ``Age_Sex.csv``, so that table would be left empty.

The cleaning notebooks emit analyst-facing column names (``median_los_minutes``,
``population_category``). ``schema.sql`` uses database-facing names
(``median_length_of_stay_min``, ``age_broad_category``). COLUMN_MAP below is the contract
between the two — update it here, not by renaming columns in the notebooks.

Usage
-----
    python -m backend.database.load_csv                 # rebuild the real database
    python -m backend.database.load_csv --db /tmp/x.db  # rebuild a throwaway copy
    python -m backend.database.load_csv --dry-run       # report only, write nothing
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd

from .database_manager import DatabaseManager, db_manager

PROJECT_ROOT = Path(__file__).parent.parent.parent
WORKBOOK = PROJECT_ROOT / "data" / "cleaned dataset" / "Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx"
CSV_DIR = PROJECT_ROOT / "data" / "Explorer Dataset"
SCHEMA_FILE = Path(__file__).parent / "schema.sql"

# table -> (workbook sheet, fallback CSV stem)
SOURCES: Dict[str, tuple] = {
    "ed_visits": ("ED_Visits", "ED_Visits"),
    "ctas_triage": ("CTAS_Triage", "CTAS_Triage"),
    "visit_disposition": ("Visit_Disposition", "Visit_Disposition"),
    "age_sex": ("Age_Sex", "Age_Sex"),
    "main_problems": ("Main_Problems", "Main_Problems"),
    "demographics": ("Demographics", "Demographics"),
}

# Cleaned (analyst) column name -> schema (database) column name
COLUMN_MAP: Dict[str, str] = {
    "median_los_minutes": "median_length_of_stay_min",
    "median_los_hours": "length_of_stay_hours",
    "population_category": "age_broad_category",
    "admission_flag": "is_admitted",
    "visit_percentage": "percentage",
}

# Columns the cleaning layer adds that no schema table stores.
DROP_COLUMNS = {"erbi", "admission_status", "population_category.1"}


def map_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Renames cleaned columns to schema names and drops analyst-only extras."""
    renamed = df.rename(columns=COLUMN_MAP)
    keep = [c for c in renamed.columns if c not in DROP_COLUMNS]
    # A duplicate name can survive the rename (e.g. two sources of age_broad_category)
    return renamed[keep].loc[:, ~renamed[keep].columns.duplicated()]


def align_to_table(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """Keeps only columns the target table actually declares, preserving table order."""
    return df[[c for c in columns if c in df.columns]]


def read_sources(prefer_workbook: bool = True) -> Dict[str, pd.DataFrame]:
    """Loads every available dataset, workbook first, CSV directory as fallback."""
    frames: Dict[str, pd.DataFrame] = {}

    sheets: Dict[str, pd.DataFrame] = {}
    if prefer_workbook and WORKBOOK.exists():
        sheets = pd.read_excel(WORKBOOK, sheet_name=None)
        print(f"Reading cleaned master workbook: {WORKBOOK.name}")
    elif prefer_workbook:
        print(f"WARNING: workbook not found at {WORKBOOK}")

    for table, (sheet_name, csv_stem) in SOURCES.items():
        if sheet_name in sheets:
            frames[table] = sheets[sheet_name]
            continue

        csv_path = CSV_DIR / f"{csv_stem}.csv"
        if csv_path.exists():
            frames[table] = pd.read_csv(csv_path)
            print(f"  {table}: workbook sheet missing, using {csv_path.name}")
        else:
            print(f"  SKIP {table}: no sheet '{sheet_name}' and no {csv_path.name}")

    return frames


def load_datasets(target_db: Optional[str] = None, dry_run: bool = False) -> Dict[str, int]:
    """Initializes the schema and loads every cleaned dataset. Returns rows per table."""
    manager = DatabaseManager(target_db) if target_db else db_manager

    frames = read_sources()
    if not frames:
        raise FileNotFoundError(
            "No cleaned datasets found. Expected the master workbook at "
            f"{WORKBOOK} or CSVs in {CSV_DIR}."
        )

    if dry_run:
        print("\n--- DRY RUN: nothing written ---")
        return {t: len(df) for t, df in frames.items()}

    manager.execute_script(SCHEMA_FILE.read_text(encoding="utf-8"))

    loaded: Dict[str, int] = {}
    timestamp = datetime.now().isoformat()
    source_name = WORKBOOK.name if WORKBOOK.exists() else CSV_DIR.name

    with manager.connection() as conn:
        for table, df in frames.items():
            existing = [r[1] for r in conn.execute(f'PRAGMA table_info("{table}")').fetchall()]
            prepared = align_to_table(map_columns(df), existing)

            conn.execute(f'DELETE FROM "{table}"')
            prepared.to_sql(table, conn, if_exists="append", index=False)

            loaded[table] = len(prepared)
            conn.execute(
                "INSERT OR REPLACE INTO metadata "
                "(table_name, csv_file, row_count, column_count, last_updated) "
                "VALUES (?, ?, ?, ?, ?)",
                (table, source_name, len(prepared), len(prepared.columns), timestamp),
            )
            print(f"  Loaded {table:20} {len(prepared):>6} rows, {len(prepared.columns)} cols")

        conn.commit()

    return loaded


# Kept for backward compatibility with any caller of the previous entry point.
def load_csv_datasets() -> Dict[str, int]:
    return load_datasets()


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Rebuild healthcare.db from cleaned datasets.")
    parser.add_argument("--db", dest="db", default=None, help="Target database path (default: backend/database/healthcare.db)")
    parser.add_argument("--dry-run", action="store_true", help="Report what would load without writing")
    args = parser.parse_args(argv)

    print("=== Healthcare Analytics Platform — Database Load ===")
    loaded = load_datasets(target_db=args.db, dry_run=args.dry_run)
    total = sum(loaded.values())
    print(f"\nTotal: {total:,} rows across {len(loaded)} tables.")
    if not args.dry_run:
        print(f"Database: {args.db or db_manager.db_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
