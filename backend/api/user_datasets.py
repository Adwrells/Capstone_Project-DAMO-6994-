"""Persistence for datasets cleaned by a web user, isolated from the seeded cohort."""

from typing import Any, Dict, List, Optional

try:
    from fastapi import APIRouter, Header, HTTPException
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

    def Header(default=None, **kwargs):  # noqa: N802 - mirrors the FastAPI name
        return default

# Browser-supplied session identifier, scoping each caller to their own uploads.
#
# This is isolation, not authentication. The header is opaque and unverified, so anyone
# can forge it with curl. It reliably stops users from seeing each other's data by
# accident; it is not a defence against a determined caller. Real confidentiality needs
# authentication and transport security — see architecture.md §6.4.
SESSION_HEADER = "X-Session-Id"

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
async def persist_cleaned_dataset(
    payload: PersistRequest,
    x_session_id: Optional[str] = Header(default=None),
) -> Dict[str, Any]:
    """Writes a user's cleaned rows to their own isolated table."""
    try:
        entry = user_dataset_service.persist(
            records=payload.records,
            display_name=payload.display_name,
            quality_score=payload.quality_score,
            owner_id=x_session_id,
        )
        return {"success": True, **entry}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to persist dataset: {e}")


@router.get("")
async def list_user_datasets(
    x_session_id: Optional[str] = Header(default=None),
) -> Dict[str, Any]:
    """Datasets belonging to the calling session, newest first.

    Without a session header every dataset is returned, which keeps offline and
    administrative callers working.
    """
    datasets = user_dataset_service.list_datasets(owner_id=x_session_id)
    return {"success": True, "count": len(datasets), "datasets": datasets}


@router.get("/{dataset_id}")
async def get_user_dataset(
    dataset_id: str,
    limit: int = 1000,
    x_session_id: Optional[str] = Header(default=None),
) -> Dict[str, Any]:
    """Rows for one persisted dataset owned by the calling session."""
    result = user_dataset_service.get_records(dataset_id, limit=limit, owner_id=x_session_id)
    if result is None:
        # 404 rather than 403: confirming that an id exists but belongs to someone else
        # would leak the existence of other sessions' data.
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    return {"success": True, **result}


@router.delete("/{dataset_id}")
async def delete_user_dataset(
    dataset_id: str,
    x_session_id: Optional[str] = Header(default=None),
) -> Dict[str, Any]:
    """Drops a persisted dataset owned by the calling session."""
    if not user_dataset_service.delete_dataset(dataset_id, owner_id=x_session_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    return {"success": True, "deleted": dataset_id}
