"""
Healthcare Analytics Platform - API Router: Strategic Insights
Generates data-driven recommendations from real ED analytics data in SQLite.
No hardcoded values. All insights derived from actual dataset statistics.
"""

from typing import Dict, Any, List, Optional

try:
    from fastapi import APIRouter, HTTPException
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def post(self, *args, **kwargs): return lambda f: f
        def get(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail

try:
    from backend.services.insights_service import DATA_SOURCE, insights_service
except ImportError:
    from services.insights_service import DATA_SOURCE, insights_service

router = APIRouter(prefix="/api/insights", tags=["Insights"])


@router.get("/recommendations")
@router.post("/recommendations")
def get_strategic_recommendations(payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generates data-driven strategic recommendations from the SQLite ED database tables."""
    try:
        return {"success": True, **insights_service.get_recommendations()}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate strategic recommendations: {str(e)}"
        )


@router.get("/summary")
def get_insights_summary() -> Dict[str, Any]:
    """Returns analytical summary of SQLite tables."""
    try:
        return {"success": True, "tables": insights_service.get_summary()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
