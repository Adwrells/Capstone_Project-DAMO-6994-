"""
Healthcare Analytics Platform - API Router: Statistical Analysis
Provides standardized statistical endpoints:
- GET /statistics/summary
- GET /statistics/h1
- GET /statistics/h2
- GET /statistics/h3
- GET /statistics/h4
- GET /statistics/h5
- GET /statistics/dashboard
All statistical hypothesis testing and metrics are computed EXCLUSIVELY from SQLite database tables.
"""

from typing import Dict, Any, List, Optional
import math

try:
    from fastapi import APIRouter, HTTPException, Query
    from pydantic import BaseModel
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def post(self, *args, **kwargs): return lambda f: f
        def get(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail
    class BaseModel: pass

from backend.analytics.descriptive import get_table_descriptive_metrics, calculate_five_number_summary, calculate_mean, calculate_std
from backend.analytics.hypothesis_testing import run_h1_test, run_h2_test, run_h4_test
from backend.analytics.regression import run_h3_regression, linear_regression
from backend.analytics.trend_analysis import run_ed_visits_trend_analysis, mann_kendall_test
from backend.analytics.forecasting import run_ed_visits_forecasting
from backend.analytics.erbi import compute_erbi_metrics

router = APIRouter(prefix="/api/statistics", tags=["Statistics Engine"])


@router.get("/summary")
@router.post("/summary")
async def get_summary_statistics(payload: Optional[Dict[str, Any]] = None, table_name: str = Query("ed_visits")) -> Dict[str, Any]:
    """Returns summary statistics, distributions, missing values, and outliers from SQLite."""
    if payload and "values" in payload:
        values = [float(v) for v in payload.get("values", []) if isinstance(v, (int, float)) and not math.isnan(float(v))]
        if not values:
            return {"success": False, "error": "No numeric values provided."}
        summary = calculate_five_number_summary(values)
        mean_val = calculate_mean(values)
        std_val = calculate_std(values)
        return {
            "success": True,
            "n": len(values),
            "mean": round(mean_val, 4),
            "std_dev": round(std_val, 4),
            "summary": summary
        }

    res = get_table_descriptive_metrics(table_name)
    return {"success": True, "source": "SQLite Database", **res}


@router.get("/h1")
async def get_hypothesis_h1() -> Dict[str, Any]:
    """GET /statistics/h1: Weighted Kruskal-Wallis & Dunn Post-Hoc across CTAS Triage Levels."""
    try:
        res = run_h1_test()
        return {"success": True, "source": "SQLite Database (ctas_triage)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H1 execution error: {str(e)}")


@router.get("/h2")
async def get_hypothesis_h2() -> Dict[str, Any]:
    """GET /statistics/h2: Weighted Mann-Whitney U test for Visit Disposition (Admitted vs Discharged)."""
    try:
        res = run_h2_test()
        return {"success": True, "source": "SQLite Database (visit_disposition)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H2 execution error: {str(e)}")


@router.get("/h3")
async def get_hypothesis_h3() -> Dict[str, Any]:
    """GET /statistics/h3: Weighted Least Squares (WLS) linear regression for CTAS Urgency Score."""
    try:
        res = run_h3_regression()
        return {"success": True, "source": "SQLite Database (ctas_triage)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H3 execution error: {str(e)}")


@router.get("/h4")
async def get_hypothesis_h4() -> Dict[str, Any]:
    """GET /statistics/h4: Weighted Kruskal-Wallis & Dunn Post-Hoc across Age Groups."""
    try:
        res = run_h4_test()
        return {"success": True, "source": "SQLite Database (age_sex)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H4 execution error: {str(e)}")


@router.get("/h5")
async def get_hypothesis_h5() -> Dict[str, Any]:
    """GET /statistics/h5: Mann-Kendall Trend Test & Exponential Smoothing Forecast."""
    try:
        trend_res = run_ed_visits_trend_analysis()
        forecast_res = run_ed_visits_forecasting(horizon=5)
        erbi_res = compute_erbi_metrics()
        return {
            "success": True,
            "source": "SQLite Database",
            "trend_analysis": trend_res,
            "forecasting": forecast_res,
            "erbi_metrics": erbi_res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H5 execution error: {str(e)}")


@router.get("/dashboard")
async def get_statistics_dashboard() -> Dict[str, Any]:
    """GET /statistics/dashboard: Comprehensive summary of all statistical hypothesis testing results."""
    try:
        h1 = run_h1_test()
        h2 = run_h2_test()
        h3 = run_h3_regression()
        h4 = run_h4_test()
        h5 = run_ed_visits_trend_analysis()
        erbi = compute_erbi_metrics()

        return {
            "success": True,
            "source": "SQLite Database (healthcare.db)",
            "summary_dashboard": {
                "H1_Triage_Difference": {
                    "test": h1.get("test_name"),
                    "decision": h1.get("decision"),
                    "p_value": h1.get("p_value")
                },
                "H2_Admission_Difference": {
                    "test": h2.get("test_name"),
                    "decision": h2.get("decision"),
                    "p_value": h2.get("p_value")
                },
                "H3_Urgency_WLS_Regression": {
                    "model": h3.get("regression_type"),
                    "r_squared": h3.get("r_squared"),
                    "slope": h3.get("slope"),
                    "decision": h3.get("decision")
                },
                "H4_Age_Group_Difference": {
                    "test": h4.get("test_name"),
                    "decision": h4.get("decision"),
                    "p_value": h4.get("p_value")
                },
                "H5_Volume_Trend": {
                    "test": "Mann-Kendall Trend Test",
                    "trend": h5.get("mann_kendall_result", {}).get("trend"),
                    "p_value": h5.get("mann_kendall_result", {}).get("p_value")
                },
                "Resource_Burden": {
                    "overall_erbi": erbi.get("overall_erbi_score")
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(e)}")


@router.post("/regression")
async def get_linear_regression(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Computes OLS linear regression between two numeric arrays."""
    x_vals = [float(v) for v in payload.get("x", []) if isinstance(v, (int, float))]
    y_vals = [float(v) for v in payload.get("y", []) if isinstance(v, (int, float))]
    if len(x_vals) < 3 or len(x_vals) != len(y_vals):
        return {"success": False, "error": "Need at least 3 paired values for regression."}
    result = linear_regression(x_vals, y_vals)
    return {"success": True, **result}


@router.post("/trend")
async def compute_trend_analysis(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Computes Mann-Kendall trend test over a time series."""
    values = [float(v) for v in payload.get("values", []) if isinstance(v, (int, float))]
    if len(values) < 3:
        return {"success": False, "error": "Need at least 3 data points for Mann-Kendall trend analysis."}
    result = mann_kendall_test(values)
    return {"success": True, **result}
