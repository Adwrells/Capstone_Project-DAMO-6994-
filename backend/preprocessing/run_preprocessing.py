"""
Healthcare Analytics Platform - Preprocessing Pipeline Runner
Executes the sequential preprocessing pipeline:
cleaning.py -> transformations.py -> feature_engineering.py -> validation.py
Then outputs optimized CSVs, the cleaned Excel workbook, and populates SQLite.
"""

import sys
from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.preprocessing.cleaning import clean_raw_datasets
from backend.preprocessing.transformations import apply_transformations
from backend.preprocessing.feature_engineering import add_feature_engineering
from backend.preprocessing.validation import run_full_validation

OPTIMIZED_DATA_DIR = PROJECT_ROOT / "data" / "optimized"
CLEANED_EXCEL_PATH = PROJECT_ROOT / "data" / "cleaned dataset" / "Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx"


def execute_pipeline():
    """
    Executes the entire data preprocessing pipeline sequentially:
    cleaning.py -> transformations.py -> feature_engineering.py -> validation.py
    """
    print("=" * 60)
    print("STARTING PREPROCESSING PIPELINE Execution")
    print("=" * 60)

    # Step 1: Cleaning
    print("[1/4] Running cleaning.py (Extracting & Cleaning Raw CIHI Excel Data)...")
    cleaned_datasets = clean_raw_datasets()
    for k, df in cleaned_datasets.items():
        print(f"  - {k}: {len(df)} rows, {len(df.columns)} columns")

    # Step 2: Transformations
    print("\n[2/4] Running transformations.py (Standardizing strings & types)...")
    transformed_datasets = apply_transformations(cleaned_datasets)

    # Step 3: Feature Engineering
    print("\n[3/4] Running feature_engineering.py (Generating derived features)...")
    engineered_datasets = add_feature_engineering(transformed_datasets)
    for k, df in engineered_datasets.items():
        print(f"  - {k} (with features): {list(df.columns)}")

    # Step 4: Validation
    print("\n[4/4] Running validation.py (Validating schema, data types & integrity)...")
    val_result = run_full_validation(engineered_datasets)
    print(f"  Validation Status: {val_result['status']}")

    # Save to data/optimized CSVs
    print("\nWriting analysis-ready CSV files to data/optimized/...")
    OPTIMIZED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Remove old outdated CSV files in data/optimized/ if present
    legacy_files = [
        OPTIMIZED_DATA_DIR / "ED Visits from 2003 - 2021.csv",
        OPTIMIZED_DATA_DIR / "ED visits by month, age and sex, participating provinces.csv",
        OPTIMIZED_DATA_DIR / "Top 10 Main Problems.csv"
    ]
    for old_f in legacy_files:
        if old_f.exists():
            old_f.unlink()

    csv_mapping = {
        "ED_Visits": OPTIMIZED_DATA_DIR / "ED_Visits.csv",
        "CTAS_Triage": OPTIMIZED_DATA_DIR / "CTAS_Triage.csv",
        "Visit_Disposition": OPTIMIZED_DATA_DIR / "Visit_Disposition.csv",
        "Age_Sex": OPTIMIZED_DATA_DIR / "Age_Sex.csv",
        "Main_Problems": OPTIMIZED_DATA_DIR / "Main_Problems.csv",
        "Demographics": OPTIMIZED_DATA_DIR / "Demographics.csv",
    }

    for key, csv_path in csv_mapping.items():
        engineered_datasets[key].to_csv(csv_path, index=False, encoding="utf-8")
        print(f"  - Saved {csv_path.name} ({len(engineered_datasets[key])} rows)")

    # Save to data/cleaned dataset/Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx
    print(f"\nWriting 6-sheet workbook to {CLEANED_EXCEL_PATH}...")
    CLEANED_EXCEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(CLEANED_EXCEL_PATH, engine="openpyxl") as writer:
        for sheet_name in ["ED_Visits", "CTAS_Triage", "Visit_Disposition", "Age_Sex", "Main_Problems", "Demographics"]:
            engineered_datasets[sheet_name].to_excel(writer, sheet_name=sheet_name, index=False)
    print("  - Excel workbook created successfully with 6 sheets.")

    # Load SQLite Database
    print("\nUpdating SQLite database (backend/database/healthcare.db)...")
    from backend.database.load_csv import load_csv_datasets
    load_csv_datasets()

    print("\n" + "=" * 60)
    print("PREPROCESSING PIPELINE COMPLETED SUCCESSFULLY")
    print("=" * 60)


if __name__ == "__main__":
    execute_pipeline()
