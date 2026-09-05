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
- GET /statistics/methods
All statistical hypothesis testing and metrics are computed EXCLUSIVELY from SQLite database tables.

H1/H2/H4 are frequency-weighted by ed_visits: each row is an aggregate summarising many
visits, so the tests run over the weight-expanded population rather than over the
aggregate row count. See backend/analytics/statistics/weighted.py.
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
from backend.analytics.hypothesis_testing import (
    ALPHA,
    TEST_KRUSKAL,
    TEST_MANN_WHITNEY,
    run_h1_test,
    run_h2_test,
    run_h4_test,
    run_h5_test,
)
from backend.analytics.hypotheses_registry import methods_payload
from backend.analytics.regression import run_h3_regression, linear_regression
from backend.analytics.trend_analysis import run_ed_visits_trend_analysis, mann_kendall_test
from backend.analytics.forecasting import run_ed_visits_forecasting
from backend.analytics.erbi import compute_erbi_metrics

router = APIRouter(prefix="/api/statistics", tags=["Statistics Engine"])


@router.get("/summary")
@router.post("/summary")
def get_summary_statistics(payload: Optional[Dict[str, Any]] = None, table_name: str = Query("ed_visits")) -> Dict[str, Any]:
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
def get_hypothesis_h1() -> Dict[str, Any]:
    """GET /statistics/h1: Weighted Kruskal-Wallis & Dunn Post-Hoc across CTAS Triage Levels."""
    try:
        res = run_h1_test()
        return {"success": True, "source": "SQLite Database (ctas_triage)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H1 execution error: {str(e)}")


@router.get("/h2")
def get_hypothesis_h2() -> Dict[str, Any]:
    """GET /statistics/h2: Weighted Mann-Whitney U test for Visit Disposition (Admitted vs Non-Admitted)."""
    try:
        res = run_h2_test()
        return {"success": True, "source": "SQLite Database (visit_disposition)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H2 execution error: {str(e)}")


@router.get("/h3")
def get_hypothesis_h3() -> Dict[str, Any]:
    """GET /statistics/h3: Weighted Least Squares (WLS) linear regression for CTAS Urgency Score."""
    try:
        res = run_h3_regression()
        return {"success": True, "source": "SQLite Database (ctas_triage)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H3 execution error: {str(e)}")


@router.get("/h4")
def get_hypothesis_h4() -> Dict[str, Any]:
    """GET /statistics/h4: Weighted Kruskal-Wallis & Dunn Post-Hoc across Age Groups."""
    try:
        res = run_h4_test()
        return {"success": True, "source": "SQLite Database (age_sex)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H4 execution error: {str(e)}")


@router.get("/h5")
def get_hypothesis_h5() -> Dict[str, Any]:
    """GET /statistics/h5: Pearson Chi-Square Test of Independence (Sex x Visit Disposition)."""
    try:
        res = run_h5_test()
        return {"success": True, "source": "SQLite Database (visit_disposition)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H5 execution error: {str(e)}")


@router.get("/trend")
@router.get("/trends")
def get_trend_analysis() -> Dict[str, Any]:
    """GET /statistics/trend: Mann-Kendall Trend Test and Sen's Slope Estimator across 19 fiscal years."""
    try:
        trend_res = run_ed_visits_trend_analysis()
        return {"success": True, "source": "SQLite Database (age_sex)", **trend_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis error: {str(e)}")


@router.get("/forecast")
def get_forecasting(horizon: int = Query(5, ge=1, le=10)) -> Dict[str, Any]:
    """GET /statistics/forecast: Simple Exponential Smoothing (SES) annual ED visit forecasting."""
    try:
        forecast_res = run_ed_visits_forecasting(horizon=horizon)
        return {"success": True, "source": "SQLite Database (age_sex)", **forecast_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")


@router.get("/erbi")
def get_erbi_metrics() -> Dict[str, Any]:
    """GET /statistics/erbi: Canonical Estimated Resource Burden Index (ERBI) calculations."""
    try:
        erbi_res = compute_erbi_metrics()
        return {"success": True, "source": "SQLite Database (ctas_triage)", **erbi_res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ERBI calculation error: {str(e)}")


@router.get("/dashboard")
def get_statistics_dashboard() -> Dict[str, Any]:
    """GET /statistics/dashboard: Comprehensive summary of all statistical hypothesis testing results."""
    try:
        h1 = run_h1_test()
        h2 = run_h2_test()
        h3 = run_h3_regression()
        h4 = run_h4_test()
        h5 = run_h5_test()
        trend = run_ed_visits_trend_analysis()
        erbi = compute_erbi_metrics()

        return {
            "success": True,
            "source": "SQLite Database (healthcare.db)",
            "alpha": ALPHA,
            "summary_dashboard": {
                "H1_Triage_Difference": {
                    "test": h1.get("test_name"),
                    "decision": h1.get("decision"),
                    "p_value": h1.get("p_value"),
                    "degrees_of_freedom": h1.get("degrees_of_freedom"),
                    "effect_size": h1.get("epsilon_squared"),
                    "effect_size_metric": "epsilon_squared",
                    "effect_size_magnitude": h1.get("effect_size_magnitude"),
                    "weighted_n": h1.get("weighted_n"),
                },
                "H2_Admission_Difference": {
                    "test": h2.get("test_name"),
                    "decision": h2.get("decision"),
                    "p_value": h2.get("p_value"),
                    "effect_size": h2.get("rank_biserial"),
                    "effect_size_metric": "rank_biserial",
                    "weighted_n": h2.get("weighted_n"),
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
                    "p_value": h4.get("p_value"),
                    "degrees_of_freedom": h4.get("degrees_of_freedom"),
                    "effect_size": h4.get("epsilon_squared"),
                    "effect_size_metric": "epsilon_squared",
                    "effect_size_magnitude": h4.get("effect_size_magnitude"),
                    "weighted_n": h4.get("weighted_n"),
                },
                "H5_Sex_Disposition": {
                    "test": "Pearson Chi-Square Test of Independence",
                    "chi2_statistic": h5.get("results", {}).get("chi2_statistic"),
                    "p_value": h5.get("results", {}).get("p_value"),
                    "degrees_of_freedom": h5.get("results", {}).get("degrees_of_freedom"),
                    "cramers_v": h5.get("cramers_v"),
                    "effect_size": h5.get("cramers_v"),
                    "effect_size_metric": "cramers_v",
                    "effect_size_magnitude": h5.get("effect_size_magnitude"),
                    "decision": h5.get("results", {}).get("decision"),
                    "total_visits_analyzed": h5.get("total_visits_analyzed"),
                },
                "Longitudinal_Trend": {
                    "test": "Mann-Kendall Trend Test",
                    "trend": trend.get("mann_kendall_result", {}).get("trend"),
                    "z_score": trend.get("mann_kendall_result", {}).get("z_score"),
                    "sens_slope": trend.get("mann_kendall_result", {}).get("sens_slope"),
                    "p_value": trend.get("mann_kendall_result", {}).get("p_value"),
                    "decision": trend.get("mann_kendall_result", {}).get("decision"),
                },
                "Resource_Burden": {
                    "overall_erbi": erbi.get("overall_erbi_score"),
                    "overall_erbi_score": erbi.get("overall_erbi_score"),
                    "total_burden_hours": erbi.get("total_burden_hours"),
                    "units": erbi.get("units")
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(e)}")


@router.get("/methods")
def get_statistical_methods() -> Dict[str, Any]:
    """GET /statistics/methods: canonical algorithm and hypothesis registry definitions."""
    return {"success": True, **methods_payload()}


@router.post("/regression")
def get_linear_regression(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Computes OLS linear regression between two numeric arrays."""
    x_vals = [float(v) for v in payload.get("x", []) if isinstance(v, (int, float))]
    y_vals = [float(v) for v in payload.get("y", []) if isinstance(v, (int, float))]
    if len(x_vals) < 3 or len(x_vals) != len(y_vals):
        return {"success": False, "error": "Need at least 3 paired values for regression."}
    result = linear_regression(x_vals, y_vals)
    return {"success": True, **result}


@router.post("/trend")
def compute_trend_analysis(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Computes Mann-Kendall trend test over a time series."""
    values = [float(v) for v in payload.get("values", []) if isinstance(v, (int, float))]
    if len(values) < 3:
        return {"success": False, "error": "Need at least 3 data points for Mann-Kendall trend analysis."}
    result = mann_kendall_test(values)
    return {"success": True, **result}
