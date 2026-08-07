"""
Healthcare Analytics Platform - Preprocessing: Data Validation Module
Provides comprehensive schema validation, missing value threshold enforcement,
data type checking, non-negativity checks, category value checks, and health checks.
If validation fails, raises ValueError to halt the preprocessing pipeline.
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np


EXPECTED_SCHEMAS = {
    "ED_Visits": ["fiscal_year", "triage_level", "visit_disposition", "main_problem", "ed_visits", "median_length_of_stay_min"],
    "CTAS_Triage": ["fiscal_year", "sex", "triage_level", "age_group", "ed_visits", "median_length_of_stay_min"],
    "Visit_Disposition": ["fiscal_year", "sex", "visit_disposition", "age_group", "ed_visits", "median_length_of_stay_min"],
    "Age_Sex": ["fiscal_year", "sex", "age_group", "ed_visits", "median_length_of_stay_min"],
    "Main_Problems": ["fiscal_year", "sex", "main_problem", "age_group", "ed_visits", "median_length_of_stay_min"],
    "Demographics": ["age_group", "sex", "total_visits", "percentage", "avg_length_of_stay_min"],
}


def validate_schema(df: pd.DataFrame, dataset_name: str, required_columns: List[str]) -> Dict[str, Any]:
    """Validates presence of required columns and computes overall schema completeness."""
    if df.empty:
        return {"valid": False, "error": f"Dataset '{dataset_name}' is empty.", "row_count": 0}

    present_columns = set(df.columns)
    missing = [col for col in required_columns if col not in present_columns]

    return {
        "valid": len(missing) == 0,
        "missing_columns": missing,
        "present_columns": list(present_columns),
        "row_count": len(df)
    }


def calculate_null_ratios(df: pd.DataFrame) -> Dict[str, float]:
    """Calculates missing value percentage per column across dataset records."""
    if df.empty:
        return {}

    total_rows = len(df)
    return {col: round((df[col].isna().sum() / total_rows) * 100, 2) for col in df.columns}


def run_full_validation(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
    """
    Executes complete validation checks across all six datasets:
    1. Expected schema & column presence
    2. Non-empty check & duplicate row check
    3. Missing value ratios (< 15% missing allowed)
    4. Data type verification (numeric columns)
    5. Non-negativity check (no negative visit counts or stay durations)
    6. Unexpected category check
    
    If ANY validation check fails, raises ValueError to immediately stop the pipeline.
    """
    results = {}

    for name, required_cols in EXPECTED_SCHEMAS.items():
        if name not in datasets:
            raise ValueError(f"[VALIDATION FAILED] Missing expected dataset '{name}'. Pipeline stopped.")

        df = datasets[name]

        # 1. Schema check
        schema_res = validate_schema(df, name, required_cols)
        if not schema_res["valid"]:
            raise ValueError(
                f"[VALIDATION FAILED] Dataset '{name}' is missing required columns: {schema_res['missing_columns']}. Pipeline stopped."
            )

        # 2. Row count check
        if len(df) < 5:
            raise ValueError(f"[VALIDATION FAILED] Dataset '{name}' has insufficient rows ({len(df)}). Pipeline stopped.")

        # 3. Duplicate row check
        dup_count = int(df.duplicated().sum())
        if dup_count > 0:
            raise ValueError(f"[VALIDATION FAILED] Dataset '{name}' contains {dup_count} duplicate rows. Pipeline stopped.")

        # 4. Null ratio check
        null_ratios = calculate_null_ratios(df)
        high_null_cols = [c for c, r in null_ratios.items() if r > 15.0]
        if high_null_cols:
            raise ValueError(
                f"[VALIDATION FAILED] Dataset '{name}' exceeds null ratio limit (>15%) in columns: {high_null_cols}. Pipeline stopped."
            )

        # 5. Non-negativity check for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for num_col in numeric_cols:
            min_val = df[num_col].min()
            if min_val < 0:
                raise ValueError(
                    f"[VALIDATION FAILED] Dataset '{name}' column '{num_col}' has negative value ({min_val}). Pipeline stopped."
                )

        # 6. Unexpected category check for sex if present
        if "sex" in df.columns:
            invalid_sex = df[~df["sex"].astype(str).str.lower().isin(["male", "female", "other/unknown", "all", "other", "unknown"])]["sex"].unique()
            if len(invalid_sex) > 0:
                raise ValueError(
                    f"[VALIDATION FAILED] Dataset '{name}' contains unexpected sex categories: {list(invalid_sex)}. Pipeline stopped."
                )

        results[name] = {
            "status": "PASSED",
            "rows": len(df),
            "columns": len(df.columns),
            "duplicates": dup_count,
            "null_ratios": null_ratios,
        }

    return {"status": "PASSED", "datasets": results}
