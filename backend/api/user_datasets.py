"""Persistence for datasets cleaned by a web user, isolated from the seeded cohort."""

from typing import Any, Dict, List, Optional

try:
    from fastapi import APIRouter, HTTPException
    from pydantic import BaseModel
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
        def post(self, *args, **kwargs): return lambda f: f
        def delete(self, *args, **kwargs): return lambda f: f

    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail

    class BaseModel:
        pass

try:
    from backend.services.user_dataset_service import user_dataset_service
except ImportError:
    from services.user_dataset_service import user_dataset_service

router = APIRouter(prefix="/api/user-datasets", tags=["User Datasets"])


class PersistRequest(BaseModel):
    records: List[Dict[str, Any]] = []
    display_name: str = "Cleaned Dataset"
    quality_score: Optional[float] = None


@router.post("")
async def persist_cleaned_dataset(payload: PersistRequest) -> Dict[str, Any]:
    """Writes a user's cleaned rows to their own isolated table."""
    try:
        entry = user_dataset_service.persist(
            records=payload.records,
            display_name=payload.display_name,
            quality_score=payload.quality_score,
        )
        return {"success": True, **entry}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to persist dataset: {e}")


@router.get("")
async def list_user_datasets() -> Dict[str, Any]:
    """Every persisted user dataset, newest first."""
    datasets = user_dataset_service.list_datasets()
    return {"success": True, "count": len(datasets), "datasets": datasets}


@router.get("/{dataset_id}")
async def get_user_dataset(dataset_id: str, limit: int = 1000) -> Dict[str, Any]:
    """Rows for one persisted dataset."""
    result = user_dataset_service.get_records(dataset_id, limit=limit)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    return {"success": True, **result}


@router.delete("/{dataset_id}")
async def delete_user_dataset(dataset_id: str) -> Dict[str, Any]:
    """Drops a persisted dataset and its registry entry."""
    if not user_dataset_service.delete_dataset(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    return {"success": True, "deleted": dataset_id}
