"""Architecture-oriented API endpoints for the platform pipeline overview."""

from typing import Any, Dict

try:
    from fastapi import APIRouter
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs):
            pass

        def get(self, *args, **kwargs):
            return lambda f: f

try:
    from backend.services.analytics_service import analytics_service
except ImportError:
    from services.analytics_service import analytics_service

router = APIRouter(prefix="/api/architecture", tags=["Architecture"])


@router.get("/pipeline")
async def get_pipeline_overview() -> Dict[str, Any]:
    return {
        "success": True,
        **analytics_service.get_pipeline_overview(),
    }
