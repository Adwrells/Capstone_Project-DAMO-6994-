"""
Healthcare Analytics Platform - FastAPI Router: Executive Dashboard Analytics
==============================================================================
Provides dedicated, validated analytical endpoints for the Executive Dashboard:
- GET /api/dashboard/kpis               (5 Executive KPIs)
- GET /api/dashboard/trends             (Longitudinal trends in visits & LOS)
- GET /api/dashboard/ctas               (H1 CTAS Acuity vs LOS)
- GET /api/dashboard/disposition        (H2 Admission Status vs LOS)
- GET /api/dashboard/regression         (H3 CTAS Urgency WLS Regression)
- GET /api/dashboard/demographics       (H4 Age Cohort vs LOS)
- GET /api/dashboard/sex-disposition    (H5 Sex vs Visit Disposition)
- GET /api/dashboard/resource-burden    (Authoritative ERBI calculations)
- GET /api/dashboard/main-problems      (Top 10 Presenting Diagnostic Conditions)
- GET /api/dashboard/hypotheses         (Hypothesis Evidence Hub Summary)
- GET /api/dashboard/summary            (Dataset provenance summary)
"""

from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException

try:
    from backend.services.dashboard_service import DATA_SOURCE, dashboard_service
except ImportError:
    from services.dashboard_service import DATA_SOURCE, dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["Executive Dashboard"])


@router.get("/kpis")
def get_dashboard_kpis() -> Dict[str, Any]:
    """Returns high-level executive KPIs derived from real SQLite ED dataset tables."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            "kpis": dashboard_service.get_kpis(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute dashboard KPIs: {str(e)}")


@router.get("/trends")
async def get_dashboard_trends() -> Dict[str, Any]:
    """Returns 19-year longitudinal trend data for ED visits, LOS, and ERBI."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_trends(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch longitudinal trends: {str(e)}")


@router.get("/ctas")
async def get_dashboard_ctas() -> Dict[str, Any]:
    """Returns H1 CTAS Acuity vs LOS distribution & Kruskal-Wallis test results."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_ctas_analysis(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch CTAS analysis: {str(e)}")


@router.get("/disposition")
async def get_dashboard_disposition() -> Dict[str, Any]:
    """Returns H2 Admission Status vs LOS distribution & Mann-Whitney U results."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_disposition_analysis(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Disposition analysis: {str(e)}")


@router.get("/regression")
async def get_dashboard_regression() -> Dict[str, Any]:
    """Returns H3 WLS Regression model & scatter plot dataset."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_regression_analysis(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Regression analysis: {str(e)}")


@router.get("/demographics")
async def get_dashboard_demographics() -> Dict[str, Any]:
    """Returns H4 Age Group vs LOS distribution & Kruskal-Wallis test results."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_demographics_analysis(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Demographics analysis: {str(e)}")


@router.get("/sex-disposition")
async def get_dashboard_sex_disposition() -> Dict[str, Any]:
    """Returns H5 Sex vs Visit Disposition contingency table & Chi-Square test."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_sex_disposition_analysis(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Sex Disposition analysis: {str(e)}")


@router.get("/resource-burden")
async def get_dashboard_resource_burden() -> Dict[str, Any]:
    """Returns authoritative Estimated Resource Burden Index (ERBI) metrics."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_resource_burden(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Resource Burden metrics: {str(e)}")


@router.get("/main-problems")
async def get_dashboard_main_problems() -> Dict[str, Any]:
    """Returns Top 10 Main Presenting Diagnostic Conditions."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            **dashboard_service.get_main_problems(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Main Problems: {str(e)}")


@router.get("/hypotheses")
async def get_dashboard_hypotheses() -> Dict[str, Any]:
    """Returns unified Hypothesis Evidence Hub payload (H1 to H5)."""
    try:
        return {
            "success": True,
            "data_source": DATA_SOURCE,
            "hypotheses": dashboard_service.get_hypotheses_hub(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Hypothesis Evidence Hub: {str(e)}")


@router.get("/summary")
def get_dashboard_summary() -> Dict[str, Any]:
    """Returns metadata summary of SQLite dataset tables."""
    try:
        return {"success": True, "tables": dashboard_service.get_summary()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
