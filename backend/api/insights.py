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
    from backend.services.strategic_synthesis_service import strategic_synthesis_service
except ImportError:
    from services.insights_service import DATA_SOURCE, insights_service
    from services.strategic_synthesis_service import strategic_synthesis_service

router = APIRouter(prefix="/api/insights", tags=["Insights"])


@router.get("/strategic")
def get_strategic_insights() -> Dict[str, Any]:
    """
    GET /api/insights/strategic

    Stage 6 Decision-Support endpoint. Synthesises all completed H1-H5 hypothesis
    results, WLS regression, Mann-Kendall trend, SES forecast, and ERBI metrics
    into a single structured payload following the StrategicInsight data contract.
    """
    try:
        payload = strategic_synthesis_service.synthesise()
        return {"success": True, **payload}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Strategic synthesis failed: {str(e)}"
        )


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
