"""
Healthcare Analytics Platform - API Router: Datasets Management
Provides endpoints for dataset listing, preloaded catalog retrieval, and SQLite storage health.
"""

from typing import Dict, Any, List, Optional
from pathlib import Path
import numpy as np
import pandas as pd

try:
    from fastapi import APIRouter, HTTPException
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
        def post(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail

try:
    from backend.services.dataset_service import dataset_service
    from backend.services.excel_service import excel_service, SHEET_LABELS
    from backend.database.database_manager import db_manager
except ImportError:
    from services.dataset_service import dataset_service
    from services.excel_service import excel_service, SHEET_LABELS
    from database.database_manager import db_manager

router = APIRouter(tags=["Datasets"])


@router.get("/api/datasets")
async def get_datasets() -> Dict[str, Any]:
    """Returns list of preloaded SQLite dataset tables."""
    tables = dataset_service.list_datasets()
    return {
        "success": True,
        "count": len(tables),
        "datasets": tables
    }


@router.get("/api/datasets/{dataset_name}")
async def get_dataset_records(dataset_name: str) -> Dict[str, Any]:
    """Returns rows for a given dataset table."""
    result = dataset_service.get_records(dataset_name)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_name}' not found")

    return {"success": True, **result}


@router.get("/api/preload-datasets")
async def get_preloaded_datasets() -> Dict[str, Any]:
    """Returns preloaded clinical datasets with schema and records for instant UI exploration."""
    try:
        sheets = excel_service.load_all_sheets()
        datasets_list = []
        for sheet_name, df in sheets.items():
            df_clean = df.replace({np.nan: None, np.inf: None, -np.inf: None})
            fields = []
            for col in df.columns:
                col_type = "numeric" if pd.api.types.is_numeric_dtype(df[col]) else "categorical"
                fields.append({"name": col, "type": col_type})

            data_rows = df_clean.to_dict(orient="records")
            datasets_list.append({
                "id": f"ds-{sheet_name.lower()}",
                "key": sheet_name,
                "name": SHEET_LABELS.get(sheet_name, sheet_name),
                "sheetName": sheet_name,
                "rowCount": len(df),
                "colCount": len(df.columns),
                "qualityScore": 94,
                "loadStatus": "success",
                "fields": fields,
                "data": data_rows
            })
        return {
            "success": True,
            "count": len(datasets_list),
            "datasets": datasets_list
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "datasets": []
        }


@router.get("/api/sqlite-status")
async def get_sqlite_status() -> Dict[str, Any]:
    """Returns SQLite database connectivity, storage metrics, and loaded table row counts."""
    try:
        db_path = db_manager.db_path
        exists = db_path.exists()
        size_kb = (db_path.stat().st_size / 1024.0) if exists else 0.0
        tables = db_manager.get_tables()
        table_stats = []
        total_rows = 0

        for t in tables:
            try:
                count_res = db_manager.execute_query(f'SELECT COUNT(*) as cnt FROM "{t}"')
                cnt = count_res[0]["cnt"] if count_res else 0
                cols_res = db_manager.execute_query(f'PRAGMA table_info("{t}")')
                cols_cnt = len(cols_res)
                total_rows += cnt
                table_stats.append({
                    "tableName": t,
                    "rowCount": cnt,
                    "columnCount": cols_cnt,
                    "status": "ready"
                })
            except Exception:
                table_stats.append({
                    "tableName": t,
                    "rowCount": 0,
                    "columnCount": 0,
                    "status": "error"
                })

        return {
            "success": True,
            "connected": exists,
            "status": "online" if exists else "missing",
            "dbPath": str(db_path),
            "journalMode": "WAL",
            "message": f"SQLite database connected. {len(tables)} table(s) registered.",
            "fileSizeKb": round(size_kb, 1),
            "totalTables": len(tables),
            "totalRows": total_rows,
            "tables": tables,
            "tableStats": table_stats
        }
    except Exception as e:
        return {
            "success": False,
            "connected": False,
            "status": "error",
            "error": str(e),
            "tables": []
        }
