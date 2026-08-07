"""
Healthcare Analytics Platform - Analytics: Descriptive Statistics Engine
Computes summary statistics, missing values, IQR outliers, frequency distributions,
and descriptive metrics directly from SQLite database tables.
"""

from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from backend.database.database_manager import db_manager


def calculate_five_number_summary(values: List[float]) -> Dict[str, float]:
    """Calculates min, Q1, median, Q3, and max summary stats."""
    if not values:
        return {"min": 0.0, "q1": 0.0, "median": 0.0, "q3": 0.0, "max": 0.0, "count": 0}

    s = pd.Series(values).dropna()
    if s.empty:
        return {"min": 0.0, "q1": 0.0, "median": 0.0, "q3": 0.0, "max": 0.0, "count": 0}

    return {
        "min": float(s.min()),
        "q1": float(s.quantile(0.25)),
        "median": float(s.median()),
        "q3": float(s.quantile(0.75)),
        "max": float(s.max()),
        "count": len(s)
    }


def calculate_mean(values: List[float]) -> float:
    """Calculates arithmetic mean of numeric sequence."""
    if not values:
        return 0.0
    return float(np.mean(values))


def calculate_std(values: List[float]) -> float:
    """Calculates sample standard deviation of numeric sequence."""
    if len(values) < 2:
        return 0.0
    return float(np.std(values, ddof=1))


def get_table_descriptive_metrics(table_name: str) -> Dict[str, Any]:
    """
    Queries SQLite database table and returns complete descriptive statistics,
    missing value metrics, and outlier detection.
    """
    # Allow-list the identifier BEFORE it reaches the query. A table name cannot be bound
    # as a SQL parameter, so validating against the live table list is the only guard.
    # This function is reachable from GET /api/statistics/summary?table_name=... , i.e.
    # directly from user input — checking `df.empty` afterwards is too late.
    if table_name not in db_manager.get_tables():
        return {"error": f"Table '{table_name}' is empty or does not exist."}

    df = db_manager.read_sql(f'SELECT * FROM "{table_name}"')
    if df.empty:
        return {"error": f"Table '{table_name}' is empty or does not exist."}

    total_rows = len(df)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    # Filter out internal primary keys
    numeric_cols = [c for c in numeric_cols if c != "id"]

    summary_by_column = {}
    outliers_by_column = {}

    for col in numeric_cols:
        series = df[col].dropna()
        if series.empty:
            continue

        q1 = float(series.quantile(0.25))
        q3 = float(series.quantile(0.75))
        iqr = q3 - q1
        lower_fence = q1 - 1.5 * iqr
        upper_fence = q3 + 1.5 * iqr
        outliers = series[(series < lower_fence) | (series > upper_fence)]

        summary_by_column[col] = {
            "count": int(len(series)),
            "mean": float(series.mean()),
            "std": float(series.std(ddof=1)) if len(series) > 1 else 0.0,
            "variance": float(series.var(ddof=1)) if len(series) > 1 else 0.0,
            "min": float(series.min()),
            "q1": q1,
            "median": float(series.median()),
            "q3": q3,
            "max": float(series.max()),
            "iqr": iqr,
            "skewness": float(series.skew()) if len(series) > 2 else 0.0,
            "kurtosis": float(series.kurt()) if len(series) > 3 else 0.0,
        }

        outliers_by_column[col] = {
            "count": len(outliers),
            "pct": round((len(outliers) / total_rows) * 100, 2),
            "lower_fence": lower_fence,
            "upper_fence": upper_fence
        }

    missing_values = {col: int(df[col].isna().sum()) for col in df.columns}
    missing_pct = {col: round((count / total_rows) * 100, 2) for col, count in missing_values.items()}

    return {
        "table_name": table_name,
        "total_rows": total_rows,
        "total_columns": len(df.columns),
        "numeric_summary": summary_by_column,
        "outlier_analysis": outliers_by_column,
        "missing_counts": missing_values,
        "missing_percentages": missing_pct,
    }
