"""
Healthcare Analytics Platform - Dashboard Service Layer

Owns the executive KPI queries that previously sat inline in backend/api/dashboard.py.
Routers call this; they do not talk to the database. See architecture.md §1 principle 3
and the C2 conformance check in §4C.

Every method takes an optional `manager`, defaulting to the shared `db_manager`. Passing a
stub is what makes KPI logic testable without a populated SQLite file — the concrete cost
of the raw SQL that used to live in the router.
"""

from typing import Any, Dict, List, Optional

try:
    from backend.database.database_manager import db_manager
except ImportError:
    from database.database_manager import db_manager

DATA_SOURCE = "SQLite Database (healthcare.db)"

# Used when the ed_visits table is empty, so the dashboard renders a sane range.
DEFAULT_MIN_FISCAL_YEAR = "2003-2004"
DEFAULT_MAX_FISCAL_YEAR = "2021-2022"


def _scalar(rows: List[Dict[str, Any]], key: str, default: Any = None) -> Any:
    """First row's value for `key`, or `default` when absent, empty, or NULL."""
    if not rows:
        return default
    value = rows[0].get(key)
    return default if value is None else value


class DashboardService:
    """Computes executive KPIs and dataset metadata summaries."""

    @staticmethod
    def get_kpis(manager: Optional[Any] = None) -> Dict[str, Any]:
        """High-level executive KPIs derived from the seeded ED tables."""
        db = manager or db_manager

        tables = db.get_tables()

        total_visits = _scalar(
            db.execute_query("SELECT SUM(ed_visits) as total FROM ed_visits"), "total", 0
        )

        year_rows = db.execute_query(
            "SELECT MIN(fiscal_year) as min_fy, MAX(fiscal_year) as max_fy FROM ed_visits"
        )
        min_fy = _scalar(year_rows, "min_fy", DEFAULT_MIN_FISCAL_YEAR)
        max_fy = _scalar(year_rows, "max_fy", DEFAULT_MAX_FISCAL_YEAR)

        top_condition = _scalar(
            db.execute_query(
                "SELECT main_problem, SUM(ed_visits) as total FROM main_problems "
                "GROUP BY main_problem ORDER BY total DESC LIMIT 1"
            ),
            "main_problem",
            "N/A",
        )

        avg_los = _scalar(
            db.execute_query(
                "SELECT AVG(median_length_of_stay_min) as avg_los FROM ed_visits "
                "WHERE median_length_of_stay_min > 0"
            ),
            "avg_los",
            0.0,
        )
        avg_los_min = round(float(avg_los), 1) if avg_los else 0.0

        record_cnt = _scalar(
            db.execute_query("SELECT COUNT(*) as cnt FROM ed_visits"), "cnt", 0
        )

        return {
            "total_ed_visits": int(total_visits),
            "year_range": f"{min_fy} to {max_fy}",
            "total_records_analyzed": int(record_cnt),
            "top_condition": top_condition,
            "avg_median_length_of_stay_min": avg_los_min,
            "avg_median_length_of_stay_hours": round(avg_los_min / 60.0, 2),
            "tables_in_sqlite": len(tables),
        }

    @staticmethod
    def get_summary(manager: Optional[Any] = None) -> List[Dict[str, Any]]:
        """Provenance rows from the metadata table: source file, row and column counts."""
        db = manager or db_manager
        return db.execute_query("SELECT * FROM metadata")


dashboard_service = DashboardService()
