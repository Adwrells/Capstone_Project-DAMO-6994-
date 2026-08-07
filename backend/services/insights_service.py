"""
Healthcare Analytics Platform - Strategic Insights Service Layer

Owns the recommendation logic that previously sat inline in backend/api/insights.py.
See architecture.md §1 principle 3 and the C2 conformance check in §4C.

The two detection rules are exposed as pure functions taking a DataFrame, so they can be
tested against fixture data with no database involved.
"""

from typing import Any, Dict, List, Optional

import pandas as pd

try:
    from backend.database.database_manager import db_manager
except ImportError:
    from database.database_manager import db_manager

DATA_SOURCE = "SQLite Database (healthcare.db)"

# Tables that carry provenance rather than clinical observations.
EXCLUDED_TABLES = {"metadata", "_ingestion_meta"}

# Columns that are identifiers, not measurements — never profiled for outliers.
NON_MEASURE_COLUMNS = ("id", "fiscal_year_start")

# An outlier share below this is normal variation, not worth a recommendation.
OUTLIER_ALERT_PCT = 2.0
OUTLIER_HIGH_PRIORITY_PCT = 5.0

# Tukey fence multiplier for outlier detection.
IQR_MULTIPLIER = 1.5

# Minimum observations before quartiles mean anything.
MIN_ROWS_FOR_QUARTILES = 4

MAX_RECOMMENDATIONS = 10


def detect_outlier_recommendations(df: pd.DataFrame, table: str) -> List[Dict[str, Any]]:
    """Flags numeric columns whose Tukey-fence outlier share exceeds the alert threshold."""
    if df.empty:
        return []

    total_rows = len(df)
    numeric_cols = [
        c for c in df.columns
        if c not in NON_MEASURE_COLUMNS and df[c].dtype in ("int64", "float64")
    ]

    found: List[Dict[str, Any]] = []
    for col in numeric_cols:
        series = df[col].dropna()
        if len(series) < MIN_ROWS_FOR_QUARTILES:
            continue

        q1, q3 = float(series.quantile(0.25)), float(series.quantile(0.75))
        iqr = q3 - q1
        outliers = series[
            (series < q1 - IQR_MULTIPLIER * iqr) | (series > q3 + IQR_MULTIPLIER * iqr)
        ]
        outlier_pct = (len(outliers) / total_rows) * 100

        if outlier_pct > OUTLIER_ALERT_PCT:
            found.append({
                "category": "Operational Efficiency",
                "title": f"Length of Stay Outliers in Table '{table}' ({col})",
                "priority": "HIGH" if outlier_pct > OUTLIER_HIGH_PRIORITY_PCT else "MEDIUM",
                "table": table,
                "recommended_action": (
                    f"Detected {len(outliers)} outlier records ({outlier_pct:.1f}%) in '{col}'. "
                    "Investigate peak surge periods and long-stay outliers to optimize bed allocation."
                ),
                "expected_benefit": "Reduces bottleneck duration and median emergency department length of stay.",
            })

    return found


def detect_volume_recommendations(df: pd.DataFrame, table: str) -> List[Dict[str, Any]]:
    """Flags the triage level carrying the largest share of visits."""
    if df.empty or "ed_visits" not in df.columns or "triage_level" not in df.columns:
        return []

    by_level = (
        df.groupby("triage_level")["ed_visits"].sum().reset_index()
        .sort_values(by="ed_visits", ascending=False)
    )
    if by_level.empty:
        return []

    top_level = by_level.iloc[0]["triage_level"]
    top_vol = int(by_level.iloc[0]["ed_visits"])

    return [{
        "category": "Triage Resource Allocation",
        "title": f"High Patient Volume Concentration in CTAS Level '{top_level}'",
        "priority": "HIGH",
        "table": table,
        "recommended_action": (
            f"CTAS Level '{top_level}' accounts for {top_vol:,} visits. "
            "Expand rapid assessment zones and fast-track triage protocols for high-volume levels."
        ),
        "expected_benefit": "Accelerates time-to-physician-initial-assessment for moderate and urgent cases.",
    }]


class InsightsService:
    """Derives strategic recommendations from the seeded analytical tables."""

    @staticmethod
    def get_recommendations(manager: Optional[Any] = None) -> Dict[str, Any]:
        """Profiles every clinical table and returns the top-ranked recommendations."""
        db = manager or db_manager

        tables = db.get_tables()
        recommendations: List[Dict[str, Any]] = []

        for table in tables:
            if table in EXCLUDED_TABLES:
                continue

            df = db.read_sql(f'SELECT * FROM "{table}"')
            if df.empty:
                continue

            recommendations.extend(detect_outlier_recommendations(df, table))
            recommendations.extend(detect_volume_recommendations(df, table))

        return {
            "data_source": DATA_SOURCE,
            "tables_analyzed": len(tables),
            "total_recommendations": len(recommendations),
            "recommendations": recommendations[:MAX_RECOMMENDATIONS],
        }

    @staticmethod
    def get_summary(manager: Optional[Any] = None) -> List[Dict[str, Any]]:
        """Row counts for every table in the analytical database."""
        db = manager or db_manager

        summary: List[Dict[str, Any]] = []
        for table in db.get_tables():
            rows = db.execute_query(f'SELECT COUNT(*) as cnt FROM "{table}"')
            summary.append({"table_name": table, "row_count": rows[0]["cnt"] if rows else 0})
        return summary


insights_service = InsightsService()
