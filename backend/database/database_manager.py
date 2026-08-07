"""
Healthcare Analytics Platform - Database Manager
Handles SQLite database connection lifecycle, pooling, transaction management, and execution helpers.
"""

import sqlite3
import os
from contextlib import closing, contextmanager
from pathlib import Path
from typing import Iterator, List, Dict, Any, Optional
import pandas as pd

DB_DIR = Path(__file__).parent
DEFAULT_DB_PATH = DB_DIR / "healthcare.db"


class DatabaseManager:
    """Thread-safe SQLite Database Manager for Healthcare Analytics Platform."""

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = Path(db_path) if db_path else DEFAULT_DB_PATH
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

    def get_connection(self) -> sqlite3.Connection:
        """Establishes and returns an optimized SQLite connection.

        The caller owns the connection and must close it. Prefer the `connection()`
        context manager below, which closes it for you.
        """
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL")
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    @contextmanager
    def connection(self) -> Iterator[sqlite3.Connection]:
        """Yields a connection and always closes it on exit.

        `with sqlite3.connect(...) as conn` only commits or rolls back the transaction —
        it does NOT close the connection. Closing matters here: an open handle keeps the
        database file locked (Windows cannot delete it) and leaks a file descriptor per
        query. contextlib.closing() supplies the close; the inner `with conn` keeps the
        original transaction semantics.
        """
        with closing(self.get_connection()) as conn:
            yield conn

    def read_sql(self, sql: str, params: tuple = ()) -> pd.DataFrame:
        """Executes a SELECT query and returns the results as a Pandas DataFrame."""
        with self.connection() as conn:
            return pd.read_sql_query(sql, conn, params=params)

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Executes a SELECT query and returns rows as dictionaries."""
        with self.connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def execute_command(self, command: str, params: tuple = ()) -> int:
        """Executes an INSERT, UPDATE, or DELETE command and returns affected row count."""
        with self.connection() as conn:
            cursor = conn.cursor()
            cursor.execute(command, params)
            conn.commit()
            return cursor.rowcount

    def execute_script(self, script: str) -> None:
        """Executes a multi-statement SQL DDL/DML script."""
        with self.connection() as conn:
            cursor = conn.cursor()
            cursor.executescript(script)
            conn.commit()

    def get_tables(self) -> List[str]:
        """Returns list of user tables in the SQLite database."""
        query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        rows = self.execute_query(query)
        return [r["name"] for r in rows]


db_manager = DatabaseManager()
