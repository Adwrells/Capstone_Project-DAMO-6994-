"""
Healthcare Analytics Platform - FastAPI Router: Clean Data & Dataset Explorer APIs
Provides REST endpoints for Excel worksheets, dataset rows, statistical summaries,
correlation matrices, outlier detection, feature engineering, and data dictionaries.
"""

from typing import Dict, Any, List
import math
import os
from pathlib import Path

try:
    from fastapi import APIRouter, HTTPException
    from fastapi.responses import FileResponse, Response
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
        def post(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail
    class FileResponse:
        def __init__(self, *args, **kwargs): pass
    class Response:
        def __init__(self, *args, **kwargs): pass

try:
    from backend.services.excel_service import excel_service
except ImportError:
    from services.excel_service import excel_service

router = APIRouter(prefix="/api/dataset", tags=["Dataset Explorer Engine"])


@router.get("/download/raw-xlsx")
async def download_raw_xlsx():
    """Downloads the master Excel workbook (.xlsx) as it is."""
    try:
        path = excel_service.get_excel_path()
        if not path or not os.path.exists(path):
            raise HTTPException(status_code=404, detail="Master Excel workbook not found.")
        filename = os.path.basename(path)
        return FileResponse(
            path=str(path),
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stream raw Excel workbook: {str(e)}")


@router.get("/download/csv/{sheet}")
async def download_sheet_csv(sheet: str):
    """Downloads the specified worksheet as a CSV file."""
    try:
        sheets = excel_service.load_all_sheets()
        if sheet not in sheets:
            raise HTTPException(status_code=404, detail=f"Worksheet '{sheet}' not found.")
        df = sheets[sheet]
        csv_bytes = df.to_csv(index=False).encode('utf-8')
        return Response(
            content=csv_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{sheet}_export.csv"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate CSV for '{sheet}': {str(e)}")


@router.get("/sheets")
async def get_dataset_sheets() -> List[str]:
    """Returns list of all Excel worksheets present in the capstone workbook."""
    try:
        sheets = excel_service.get_sheet_names()
        return sheets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read Excel workbook: {str(e)}")


@router.get("/statistics/{sheet}")
async def get_dataset_sheet_statistics(sheet: str) -> Dict[str, Any]:
    """Returns comprehensive statistical profile for a given worksheet."""
    try:
        stats_payload = excel_service.get_sheet_statistics(sheet)
        return {
            "success": True,
            **stats_payload
        }
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error computing statistics for '{sheet}': {str(e)}")


@router.get("/correlation/{sheet}")
async def get_dataset_correlation(sheet: str) -> Dict[str, Any]:
    """Returns Pearson correlation matrix for all numeric columns in a worksheet."""
    try:
        import pandas as pd
        import numpy as np

        sheets = excel_service.load_all_sheets()
        if sheet not in sheets:
            raise HTTPException(status_code=404, detail=f"Sheet '{sheet}' not found.")

        df = sheets[sheet]
        numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]

        if len(numeric_cols) < 2:
            return {
                "success": True,
                "sheet_name": sheet,
                "pairs": [],
                "message": "Need at least 2 numeric columns for correlation."
            }

        pairs = []
        for i in range(len(numeric_cols)):
            for j in range(i + 1, len(numeric_cols)):
                col_a = numeric_cols[i]
                col_b = numeric_cols[j]
                # Drop rows where either column is null
                valid = df[[col_a, col_b]].dropna()
                if len(valid) < 3:
                    continue
                corr_val = float(valid[col_a].corr(valid[col_b]))
                if math.isnan(corr_val):
                    continue
                abs_r = abs(corr_val)
                strength = (
                    "Strong" if abs_r >= 0.7
                    else "Moderate" if abs_r >= 0.4
                    else "Weak" if abs_r >= 0.2
                    else "Negligible"
                )
                pairs.append({
                    "col_a": col_a,
                    "col_b": col_b,
                    "r": round(corr_val, 4),
                    "abs_r": round(abs_r, 4),
                    "strength": strength,
                    "n": len(valid),
                })

        pairs.sort(key=lambda x: x["abs_r"], reverse=True)
        return {
            "success": True,
            "sheet_name": sheet,
            "numeric_columns": numeric_cols,
            "pairs": pairs,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Correlation error for '{sheet}': {str(e)}")


@router.get("/outliers/{sheet}")
async def get_dataset_outliers(sheet: str) -> Dict[str, Any]:
    """Returns IQR-based outlier analysis for all numeric columns."""
    try:
        import pandas as pd
        import numpy as np

        sheets = excel_service.load_all_sheets()
        if sheet not in sheets:
            raise HTTPException(status_code=404, detail=f"Sheet '{sheet}' not found.")

        df = sheets[sheet]
        numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
        total_rows = len(df)

        results = []
        for col in numeric_cols:
            series = df[col].dropna()
            if len(series) < 4:
                continue
            q1 = float(series.quantile(0.25))
            q3 = float(series.quantile(0.75))
            iqr = q3 - q1
            lower_fence = q1 - 1.5 * iqr
            upper_fence = q3 + 1.5 * iqr
            outlier_count = int(((series < lower_fence) | (series > upper_fence)).sum())
            pct = round((outlier_count / total_rows) * 100, 2) if total_rows > 0 else 0.0
            severity = "High" if pct > 5 else "Low" if outlier_count > 0 else "None"
            results.append({
                "column": col,
                "q1": round(q1, 4),
                "q3": round(q3, 4),
                "iqr": round(iqr, 4),
                "lower_fence": round(lower_fence, 4),
                "upper_fence": round(upper_fence, 4),
                "outlier_count": outlier_count,
                "pct_of_data": pct,
                "severity": severity,
                "n_valid": int(len(series)),
            })

        return {
            "success": True,
            "sheet_name": sheet,
            "total_rows": total_rows,
            "numeric_columns_analyzed": len(results),
            "results": results,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outlier detection error for '{sheet}': {str(e)}")


@router.get("/features/{sheet}")
async def get_feature_engineering(sheet: str) -> Dict[str, Any]:
    """Returns automated feature engineering recommendations for a worksheet."""
    try:
        import pandas as pd

        sheets = excel_service.load_all_sheets()
        if sheet not in sheets:
            raise HTTPException(status_code=404, detail=f"Sheet '{sheet}' not found.")

        df = sheets[sheet]
        numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
        cat_cols = [c for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]

        ideas = []

        for col in numeric_cols:
            series = df[col].dropna()
            if len(series) < 2:
                continue
            col_min = float(series.min())
            col_max = float(series.max())
            col_std = float(series.std())
            range_val = col_max - col_min
            safe_name = col.lower().replace(" ", "_").replace("(", "").replace(")", "").replace("/", "_")

            if range_val > 1000:
                ideas.append({
                    "feature": f"log_{safe_name}",
                    "derived_from": col,
                    "technique": "Log Transform",
                    "rationale": f"Wide value range ({col_min:.0f}–{col_max:.0f}) indicates right skew. Natural log normalizes distribution for linear models.",
                    "priority": "High",
                })
            if col_std > 0:
                ideas.append({
                    "feature": f"{safe_name}_zscore",
                    "derived_from": col,
                    "technique": "Z-Score Standardization",
                    "rationale": f"Standardize to μ=0, σ=1. Required for distance-based algorithms (KNN, SVM, PCA).",
                    "priority": "High",
                })
            ideas.append({
                "feature": f"{safe_name}_bin5",
                "derived_from": col,
                "technique": "Quantile Binning (5 bins)",
                "rationale": "Convert to ordinal quintiles (Very Low/Low/Medium/High/Very High) for tree-based or categorical models.",
                "priority": "Medium",
            })

        for col in cat_cols[:5]:
            safe_name = col.lower().replace(" ", "_").replace("(", "").replace(")", "").replace("/", "_")
            unique_count = int(df[col].nunique())
            if unique_count <= 15:
                ideas.append({
                    "feature": f"{safe_name}_ohe",
                    "derived_from": col,
                    "technique": "One-Hot Encoding",
                    "rationale": f"Convert {unique_count} nominal categories into binary indicator variables. Required for logistic regression and neural networks.",
                    "priority": "High",
                })
            else:
                ideas.append({
                    "feature": f"{safe_name}_label",
                    "derived_from": col,
                    "technique": "Label Encoding",
                    "rationale": f"High cardinality ({unique_count} unique values). Label encoding preferred over OHE to avoid dimensionality explosion.",
                    "priority": "Medium",
                })

        if len(numeric_cols) >= 2:
            c1 = numeric_cols[0].lower().replace(" ", "_").replace("(", "").replace(")", "")
            c2 = numeric_cols[1].lower().replace(" ", "_").replace("(", "").replace(")", "")
            ideas.append({
                "feature": f"{c1}_x_{c2}",
                "derived_from": f"{numeric_cols[0]} × {numeric_cols[1]}",
                "technique": "Interaction Term (Polynomial)",
                "rationale": "Captures multiplicative relationship between two key numeric variables; useful for non-linear models.",
                "priority": "Low",
            })

        return {
            "success": True,
            "sheet_name": sheet,
            "numeric_columns": numeric_cols,
            "categorical_columns": cat_cols,
            "total_ideas": len(ideas),
            "ideas": ideas[:15],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature engineering error for '{sheet}': {str(e)}")


@router.get("/dictionary/{sheet}")
async def get_data_dictionary(sheet: str) -> Dict[str, Any]:
    """Returns data dictionary with type, cardinality, missing count, and description."""
    try:
        import pandas as pd
        import numpy as np

        sheets = excel_service.load_all_sheets()
        if sheet not in sheets:
            raise HTTPException(status_code=404, detail=f"Sheet '{sheet}' not found.")

        df = sheets[sheet]
        total_rows = len(df)
        entries = []

        for col in df.columns:
            series = df[col]
            is_numeric = pd.api.types.is_numeric_dtype(series)
            col_type = "numeric" if is_numeric else "categorical"
            missing = int(series.isna().sum())
            unique_count = int(series.nunique())

            sample_vals: list = []
            if is_numeric:
                valid = series.dropna()
                if len(valid) > 0:
                    sample_vals = [
                        f"min={float(valid.min()):.2f}",
                        f"max={float(valid.max()):.2f}",
                        f"mean={float(valid.mean()):.2f}",
                    ]
            else:
                top_vals = series.dropna().value_counts().head(5).index.tolist()
                sample_vals = [str(v) for v in top_vals]

            entries.append({
                "column": col,
                "type": col_type,
                "unique_count": unique_count,
                "missing_count": missing,
                "missing_pct": round((missing / total_rows) * 100, 2) if total_rows > 0 else 0,
                "sample_values": sample_vals,
                "description": _generate_description(col, col_type),
            })

        return {
            "success": True,
            "sheet_name": sheet,
            "total_rows": total_rows,
            "total_columns": len(df.columns),
            "entries": entries,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data dictionary error for '{sheet}': {str(e)}")


@router.get("/{sheet}")
async def get_dataset_sheet_data(sheet: str) -> Dict[str, Any]:
    """Returns dataset rows and column schema for a given worksheet."""
    try:
        data_payload = excel_service.get_sheet_data(sheet)
        return {
            "success": True,
            **data_payload
        }
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading worksheet '{sheet}': {str(e)}")


def _generate_description(col_name: str, col_type: str) -> str:
    """Generate contextual business description for a column."""
    n = col_name.lower()
    if "year" in n or "fiscal" in n:
        return "Fiscal or calendar year identifier for temporal trend analysis."
    if "province" in n or "region" in n or "jurisdiction" in n:
        return "Canadian province or territory code for geographic stratification."
    if "visit" in n and ("total" in n or "count" in n or "volume" in n):
        return "Total count of emergency department visits in the reporting period."
    if "visit" in n:
        return "Emergency department visit volume metric."
    if "admit" in n:
        return "Hospital admission indicator or admission visit count."
    if "age" in n:
        return "Patient age or age group classification for demographic analysis."
    if "sex" in n or "gender" in n:
        return "Patient biological sex category (Male/Female/Other)."
    if "month" in n:
        return "Calendar month identifier for seasonal pattern analysis."
    if "problem" in n or "diagnosis" in n or "complaint" in n or "condition" in n:
        return "Primary clinical presenting complaint or chief complaint category."
    if "triage" in n or "ctas" in n or "acuity" in n:
        return "Canadian Triage and Acuity Scale (CTAS) severity level (1=Resuscitation to 5=Non-Urgent)."
    if "wait" in n or "time" in n or "duration" in n or "stay" in n or "length" in n:
        return "Time-based operational metric measuring patient throughput efficiency (hours or minutes)."
    if "cost" in n or "resource" in n or "expenditure" in n:
        return "Financial or resource utilization metric (Canadian dollars)."
    if "percent" in n or "rate" in n or "pct" in n or "%" in n:
        return "Calculated proportion or rate metric (expressed as percentage)."
    if "rank" in n or "order" in n:
        return "Ordinal ranking indicator."
    if col_type == "numeric":
        return "Numeric operational or clinical measurement derived from administrative data."
    return "Categorical classification variable from administrative or clinical data systems."
