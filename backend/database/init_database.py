"""
Healthcare Analytics Platform - Database Schema Initializer
Executes schema.sql to initialize SQLite database tables for all six optimized datasets.
"""

from pathlib import Path
from .database_manager import db_manager

SCHEMA_FILE = Path(__file__).parent / "schema.sql"


def init_db():
    """Initializes SQLite database schema by executing schema.sql."""
    if not SCHEMA_FILE.exists():
        raise FileNotFoundError(f"Schema file not found at: {SCHEMA_FILE}")

    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    db_manager.execute_script(schema_sql)
    print("Database schema initialized successfully from schema.sql.")


if __name__ == "__main__":
    init_db()
