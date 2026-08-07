"""
Healthcare Analytics Platform - API Router: Datasets Management
"""

from typing import Dict, Any, List

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
except ImportError:
    from services.dataset_service import dataset_service

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("")
async def get_datasets() -> Dict[str, Any]:
    """Returns list of preloaded SQLite dataset tables."""
    tables = dataset_service.list_datasets()
    return {
        "success": True,
        "count": len(tables),
        "datasets": tables
    }

@router.get("/{dataset_name}")
async def get_dataset_records(dataset_name: str) -> Dict[str, Any]:
    """Returns rows for a given dataset table."""
    result = dataset_service.get_records(dataset_name)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_name}' not found")

    return {"success": True, **result}
