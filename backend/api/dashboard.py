"""
Healthcare Analytics Platform - FastAPI Router: Executive Dashboard Analytics
Computes real executive KPIs directly from SQLite database tables.
"""

from typing import Dict, Any, List
from pathlib import Path

try:
    from fastapi import APIRouter, HTTPException
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail

try:
    from backend.services.dashboard_service import DATA_SOURCE, dashboard_service
except ImportError:
    from services.dashboard_service import DATA_SOURCE, dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/kpis")
async def get_dashboard_kpis() -> Dict[str, Any]:
    """Returns high-level executive KPIs derived from real SQLite ED dataset tables."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            "kpis": dashboard_service.get_kpis(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute dashboard KPIs: {str(e)}"
        )


@router.get("/summary")
async def get_dashboard_summary() -> Dict[str, Any]:
    """Returns metadata summary of SQLite dataset tables."""
    try:
        return {"success": True, "tables": dashboard_service.get_summary()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
