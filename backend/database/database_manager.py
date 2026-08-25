"""
Healthcare Analytics Platform - Database Manager
Handles SQLite database connection lifecycle, pooling, transaction management, and execution helpers.
"""

import logging
import sqlite3
import os
from contextlib import closing, contextmanager
from pathlib import Path
from typing import Iterator, List, Dict, Any, Optional
import pandas as pd

DB_DIR = Path(__file__).parent
DEFAULT_DB_PATH = DB_DIR / "healthcare.db"

logger = logging.getLogger(__name__)


def _preview(sql: str, limit: int = 200) -> str:
    """Trims a SQL statement for logging so a large script doesn't flood the log."""
    collapsed = " ".join(sql.split())
    return collapsed if len(collapsed) <= limit else collapsed[:limit] + "…"


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
        try:
            conn = sqlite3.connect(str(self.db_path))
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA journal_mode = WAL")
            conn.execute("PRAGMA foreign_keys = ON")
            return conn
        except sqlite3.Error:
            logger.error("Failed to open SQLite connection at %s", self.db_path, exc_info=True)
            raise

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
        try:
            with self.connection() as conn:
                return pd.read_sql_query(sql, conn, params=params)
        except (sqlite3.Error, pd.errors.DatabaseError):
            logger.error("read_sql failed against %s: %s", self.db_path, _preview(sql), exc_info=True)
            raise

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Executes a SELECT query and returns rows as dictionaries."""
        try:
            with self.connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
        except sqlite3.Error:
            logger.error("execute_query failed against %s: %s", self.db_path, _preview(query), exc_info=True)
            raise

    def execute_command(self, command: str, params: tuple = ()) -> int:
        """Executes an INSERT, UPDATE, or DELETE command and returns affected row count."""
        try:
            with self.connection() as conn:
                cursor = conn.cursor()
                cursor.execute(command, params)
                conn.commit()
                return cursor.rowcount
        except sqlite3.Error:
            # Writes are the path that matters most here: this is what would have
            # surfaced the seeded-database pollution (unexpected writes landing in
            # backend/database/healthcare.db from a test run) as a loud log line
            # instead of a silent file-size change discovered after the fact.
            logger.error("execute_command failed against %s: %s", self.db_path, _preview(command), exc_info=True)
            raise

    def execute_script(self, script: str) -> None:
        """Executes a multi-statement SQL DDL/DML script."""
        try:
            with self.connection() as conn:
                cursor = conn.cursor()
                cursor.executescript(script)
                conn.commit()
        except sqlite3.Error:
            logger.error("execute_script failed against %s: %s", self.db_path, _preview(script), exc_info=True)
            raise

    def get_tables(self) -> List[str]:
        """Returns list of user tables in the SQLite database."""
        query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        rows = self.execute_query(query)
        return [r["name"] for r in rows]


db_manager = DatabaseManager()
