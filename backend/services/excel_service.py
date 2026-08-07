"""
Healthcare Analytics Platform - Excel Dataset Service Layer
Reads Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx using Pandas and openpyxl,
loading all 6 worksheets (ED_Visits, CTAS_Triage, Visit_Disposition, Age_Sex, Main_Problems, Demographics).
Exclusively utilized by Dataset Explorer endpoints.
"""

import math
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

PROJECT_ROOT = Path(__file__).parent.parent.parent
EXCEL_PATH = PROJECT_ROOT / "data" / "cleaned dataset" / "Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx"

SHEET_LABELS = {
    "ED_Visits": "ED Visits",
    "CTAS_Triage": "CTAS Triage Level",
    "Visit_Disposition": "Visit Disposition",
    "Age_Sex": "Age and Sex Distribution",
    "Main_Problems": "Main Presenting Problems",
    "Demographics": "Demographics Overview"
}


class ExcelDatasetService:
    """Thread-safe Excel dataset service for Healthcare Analytics Platform."""

    def __init__(self, excel_path: Optional[Path] = None):
        self.excel_path = excel_path or EXCEL_PATH

    def _verify_file(self) -> Path:
        if not self.excel_path.exists():
            raise FileNotFoundError(f"Workbook not found at relative path: {self.excel_path}")
        return self.excel_path

    def load_all_sheets(self) -> Dict[str, pd.DataFrame]:
        """Loads all six worksheets from the target Excel workbook using Pandas."""
        path = self._verify_file()
        sheets_dict = pd.read_excel(path, sheet_name=None)
        return sheets_dict

    def get_sheet_names(self) -> List[str]:
        """Returns list of worksheet keys present in the workbook."""
        sheets_dict = self.load_all_sheets()
        return list(sheets_dict.keys())

    def get_sheet_data(self, sheet_name: str) -> Dict[str, Any]:
        """Returns JSON-serializable rows and fields metadata for a selected worksheet."""
        sheets = self.load_all_sheets()
        if sheet_name not in sheets:
            raise KeyError(f"Worksheet '{sheet_name}' not found. Available sheets: {list(sheets.keys())}")

        df = sheets[sheet_name]
        df_clean = df.replace({np.nan: None, np.inf: None, -np.inf: None})

        fields = []
        for col in df.columns:
            col_type = "numeric" if pd.api.types.is_numeric_dtype(df[col]) else "categorical"
            fields.append({"name": str(col), "type": col_type})

        rows = df_clean.to_dict(orient="records")
        return {
            "sheet_name": sheet_name,
            "label": SHEET_LABELS.get(sheet_name, sheet_name),
            "rows_count": len(df),
            "cols_count": len(df.columns),
            "fields": fields,
            "data": rows
        }

    def get_sheet_statistics(self, sheet_name: str) -> Dict[str, Any]:
        """Computes summary statistics, missing values, duplicates, and column types."""
        sheets = self.load_all_sheets()
        if sheet_name not in sheets:
            raise KeyError(f"Worksheet '{sheet_name}' not found. Available sheets: {list(sheets.keys())}")

        df = sheets[sheet_name]
        total_rows = len(df)
        total_cols = len(df.columns)
        missing_count = int(df.isna().sum().sum())
        duplicate_count = int(df.duplicated().sum())

        numeric_cols = [str(c) for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
        categorical_cols = [str(c) for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]

        mem_bytes = df.memory_usage(deep=True).sum()
        if mem_bytes >= 1024 * 1024:
            mem_str = f"{mem_bytes / (1024 * 1024):.2f} MB"
        else:
            mem_str = f"{mem_bytes / 1024:.1f} KB"

        summary_stats = {}
        for col in numeric_cols:
            series = df[col].dropna()
            if len(series) == 0:
                continue

            mode_val = series.mode()
            mode_result = float(mode_val.iloc[0]) if not mode_val.empty else float(series.median())

            summary_stats[col] = {
                "count": int(len(series)),
                "missing": int(df[col].isna().sum()),
                "min": float(series.min()),
                "max": float(series.max()),
                "mean": float(series.mean()),
                "median": float(series.median()),
                "mode": mode_result,
                "std_dev": float(series.std(ddof=1)) if len(series) > 1 else 0.0,
                "variance": float(series.var(ddof=1)) if len(series) > 1 else 0.0,
                "q1": float(series.quantile(0.25)),
                "q3": float(series.quantile(0.75)),
            }

        return {
            "sheet_name": sheet_name,
            "label": SHEET_LABELS.get(sheet_name, sheet_name),
            "rows": total_rows,
            "columns": total_cols,
            "missing_values": missing_count,
            "duplicate_rows": duplicate_count,
            "memory_usage": mem_str,
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols,
            "summary_statistics": summary_stats
        }


excel_service = ExcelDatasetService()
