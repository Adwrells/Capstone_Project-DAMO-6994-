"""
Healthcare Analytics Platform - Preprocessing: Cleaning Module
Provides missing value imputation, record deduplication, outlier detection,
string normalization, and raw CIHI dataset extraction.
"""

from pathlib import Path
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np

PROJECT_ROOT = Path(__file__).parent.parent.parent
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"
PRIMARY_RAW_FILE = RAW_DATA_DIR / "emergency-department-visits-2003-2021-supplementary-data-tables-en.xlsx"


def remove_duplicates(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicates records based on dictionary equality."""
    seen = set()
    deduped = []
    for r in records:
        item = tuple(sorted((k, str(v)) for k, v in r.items()))
        if item not in seen:
            seen.add(item)
            deduped.append(r)
    return deduped


def clean_missing_values(records: List[Dict[str, Any]], fill_value: Any = "N/A") -> List[Dict[str, Any]]:
    """Fills empty or None values with a specified fallback representation."""
    cleaned = []
    for r in records:
        new_r = {}
        for k, v in r.items():
            if v is None or v == "" or str(v).strip().lower() in ("null", "none", "nan"):
                new_r[k] = fill_value
            else:
                new_r[k] = v
        cleaned.append(new_r)
    return cleaned


def clean_raw_datasets(raw_file_path: Path = PRIMARY_RAW_FILE) -> Dict[str, pd.DataFrame]:
    """
    Parses original CIHI supplementary data tables from raw Excel file
    and extracts six clean, analysis-ready DataFrames.
    """
    if not raw_file_path.exists():
        raise FileNotFoundError(f"Raw CIHI file not found at: {raw_file_path}")

    xl = pd.ExcelFile(raw_file_path)

    sheet_mappings = {
        "ED_Visits": (
            "1 ED visits",
            ["fiscal_year", "triage_level", "visit_disposition", "main_problem", "ed_visits", "median_length_of_stay_min"]
        ),
        "Visit_Disposition": (
            "2 Visit disposition",
            ["fiscal_year", "sex", "visit_disposition", "age_group", "ed_visits", "median_length_of_stay_min"]
        ),
        "CTAS_Triage": (
            "3 Triage level",
            ["fiscal_year", "sex", "triage_level", "age_group", "ed_visits", "median_length_of_stay_min"]
        ),
        "Main_Problems": (
            "4 Main problem",
            ["fiscal_year", "sex", "main_problem", "age_group", "ed_visits", "median_length_of_stay_min"]
        ),
        "Age_Sex": (
            "5 Age and sex",
            ["fiscal_year", "sex", "age_group", "ed_visits", "median_length_of_stay_min"]
        )
    }

    cleaned_dfs: Dict[str, pd.DataFrame] = {}

    for dataset_key, (sheet_name, col_names) in sheet_mappings.items():
        raw_df = pd.read_excel(xl, sheet_name=sheet_name)

        # Locate header row index dynamically
        hdr_idx = None
        for idx, row in raw_df.iterrows():
            if any("Fiscal year" in str(v) for v in row.values):
                hdr_idx = idx
                break

        if hdr_idx is None:
            raise ValueError(f"Could not locate header row in raw sheet '{sheet_name}'.")

        df = pd.read_excel(xl, sheet_name=sheet_name, skiprows=hdr_idx + 1)
        # Filter valid data rows matching fiscal year pattern 'YYYY-YYYY' or 'YYYY–YYYY'
        df = df[df.iloc[:, 0].astype(str).str.contains(r"^\d{4}[–\-]\d{4}$", regex=True, na=False)].copy()
        df.columns = col_names

        # String cleaning
        for col in df.columns:
            if df[col].dtype == "object":
                df[col] = df[col].astype(str).str.strip()

        # Coerce numeric columns
        df["ed_visits"] = pd.to_numeric(df["ed_visits"], errors="coerce").fillna(0).astype(int)
        df["median_length_of_stay_min"] = pd.to_numeric(df["median_length_of_stay_min"], errors="coerce").fillna(0.0)

        # Deduplicate
        df = df.drop_duplicates().reset_index(drop=True)
        cleaned_dfs[dataset_key] = df

    # Derive Demographics DataFrame from Age_Sex
    age_sex_df = cleaned_dfs["Age_Sex"]
    demo_df = age_sex_df.groupby(["age_group", "sex"]).agg(
        total_visits=("ed_visits", "sum"),
        avg_length_of_stay_min=("median_length_of_stay_min", "mean")
    ).reset_index()

    grand_total = demo_df["total_visits"].sum()
    demo_df["percentage"] = (demo_df["total_visits"] / grand_total * 100).round(2) if grand_total > 0 else 0.0
    demo_df["avg_length_of_stay_min"] = demo_df["avg_length_of_stay_min"].round(1)

    demo_df = demo_df.drop_duplicates().reset_index(drop=True)
    cleaned_dfs["Demographics"] = demo_df

    return cleaned_dfs
