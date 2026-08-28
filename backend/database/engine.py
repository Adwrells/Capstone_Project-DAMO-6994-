"""
Healthcare Analytics Platform - SQLAlchemy connection pools

Only the pool is used here, not the SQL-generation layer: DatabaseManager still hands
callers a plain sqlite3.Connection (row_factory, `?` placeholders, pandas read_sql/to_sql
all keep working unchanged) — SQLAlchemy just keeps a warm pool of physical connections
per database file instead of opening and closing one on every call.

Engines are cached per (path, pooled) pair rather than a single module-level engine,
because DatabaseManager is also constructed against isolated tmp-file databases in tests
and in `load_csv.py`. The production database (db_path=None) gets a real QueuePool, since
it now serves concurrent FastAPI request threads. A custom db_path always means an
isolated test/CLI database, so it gets NullPool instead — connections are opened and
closed per checkout exactly as before, so a test's TemporaryDirectory can be cleaned up
immediately afterward instead of waiting on pooled connections to be evicted (pooled
connections holding an open file handle past teardown fail to delete on Windows).
"""

from functools import lru_cache

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.pool import NullPool


@lru_cache(maxsize=None)
def get_engine(db_path: str, pooled: bool = True) -> Engine:
    pool_kwargs = (
        {"pool_size": 5, "max_overflow": 10, "pool_pre_ping": True}
        if pooled
        else {"poolclass": NullPool}
    )
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
        **pool_kwargs,
    )

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode = WAL")
        cursor.execute("PRAGMA foreign_keys = ON")
        cursor.close()

    return engine
