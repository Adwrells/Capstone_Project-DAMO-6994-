"""
Healthcare Analytics Platform - Preprocessing: Transformations Module
Provides data aggregation, column normalization, metric scaling, and dataset transformations.
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np


def aggregate_by_group(records: List[Dict[str, Any]], group_col: str, val_col: str) -> Dict[str, float]:
    """Aggregates numeric column sums grouped by categorical key."""
    totals: Dict[str, float] = {}
    for r in records:
        group_key = str(r.get(group_col, "Unknown"))
        raw_val = r.get(val_col, 0)
        try:
            val = float(raw_val)
        except (ValueError, TypeError):
            val = 0.0
        totals[group_key] = totals.get(group_key, 0.0) + val
    return totals


def normalize_fiscal_year(fy_str: str) -> str:
    """Normalizes fiscal year string representations (e.g., '2021–2022' to '2021-2022')."""
    if not fy_str:
        return "Unknown"
    return str(fy_str).replace("–", "-").replace("—", "-").strip()


def apply_transformations(datasets: Dict[str, pd.DataFrame]) -> Dict[str, pd.DataFrame]:
    """
    Applies data transformations to all six datasets:
    - Normalizes fiscal year hyphenation
    - Cleans categorical strings
    - Ensures non-negative values and correct numerical dtypes
    """
    transformed = {}

    for key, df in datasets.items():
        df_copy = df.copy()

        if "fiscal_year" in df_copy.columns:
            df_copy["fiscal_year"] = df_copy["fiscal_year"].apply(normalize_fiscal_year)

        for col in df_copy.columns:
            if df_copy[col].dtype == "object":
                df_copy[col] = df_copy[col].astype(str).str.strip()

        # Coerce numeric counts
        for num_col in ["ed_visits", "total_visits"]:
            if num_col in df_copy.columns:
                df_copy[num_col] = pd.to_numeric(df_copy[num_col], errors="coerce").fillna(0).astype(int)
                df_copy[num_col] = df_copy[num_col].apply(lambda x: max(0, x))

        # Coerce numeric durations
        for float_col in ["median_length_of_stay_min", "avg_length_of_stay_min", "percentage"]:
            if float_col in df_copy.columns:
                df_copy[float_col] = pd.to_numeric(df_copy[float_col], errors="coerce").fillna(0.0)
                df_copy[float_col] = df_copy[float_col].apply(lambda x: max(0.0, float(x)))

        transformed[key] = df_copy

    return transformed
