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
    def Query(default: Any = None, *args: Any, **kwargs: Any) -> Any:  # noqa: N802
        return default
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
from backend.analytics.regression import run_h3_regression, linear_regression
from backend.analytics.trend_analysis import run_ed_visits_trend_analysis, mann_kendall_test
from backend.analytics.forecasting import run_ed_visits_forecasting
from backend.analytics.erbi import compute_erbi_metrics
from backend.analytics.hypotheses_registry import methods_payload

router = APIRouter(prefix="/api/statistics", tags=["Statistics Engine"])


@router.get("/summary")
@router.post("/summary")
async def get_summary_statistics(
    payload: Optional[Dict[str, Any]] = None,
    table_name: Optional[str] = Query(default="ED_Visits"),
) -> Dict[str, Any]:
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

    res = get_table_descriptive_metrics(table_name or "ED_Visits")
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
    """
    GET /statistics/h5: Pearson Chi-Square Test of Independence — Sex × Admission Status.

    Constructs a 2×2 contingency table from visit_disposition aggregate records:
        Rows = Sex (Female, Male)
        Cols = Disposition (Non-Admitted, Admitted)
        Cell values = sum(ed_visits) — aggregate visit frequencies

    Returns chi2 statistic, degrees of freedom, p-value, Cramér's V, and
    the observed contingency table.
    """
    try:
        res = run_h5_test()
        return {"success": True, "source": "SQLite Database (visit_disposition)", **res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"H5 execution error: {str(e)}")


@router.get("/trends")
async def get_ed_trends() -> Dict[str, Any]:
    """
    GET /statistics/trends: Mann-Kendall Trend Test, Exponential Smoothing Forecast,
    and ERBI metrics. This is the longitudinal resource burden analysis (previously
    misassigned to /h5).
    """
    try:
        trend_res = run_ed_visits_trend_analysis()
        forecast_res = run_ed_visits_forecasting(horizon=5)
        erbi_res = compute_erbi_metrics()
        return {
            "success": True,
            "source": "SQLite Database",
            "trend_analysis": trend_res,
            "forecasting": forecast_res,
            "erbi_metrics": erbi_res,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trends execution error: {str(e)}")


@router.get("/dashboard")
async def get_statistics_dashboard() -> Dict[str, Any]:
    """GET /statistics/dashboard: Summary of all 5 hypothesis test results from SQLite."""
    try:
        h1 = run_h1_test()
        h2 = run_h2_test()
        h3 = run_h3_regression()
        h4 = run_h4_test()
        h5 = run_h5_test()
        erbi = compute_erbi_metrics()
        dashboard_data = {
            "H1_Triage_Difference": {
                "hypothesis": "H1: LOS differs across CTAS Triage Levels",
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
                "hypothesis": "H2: LOS differs between Admitted and Non-Admitted visits",
                "test": h2.get("test_name"),
                "decision": h2.get("decision"),
                "p_value": h2.get("p_value"),
                "effect_size": h2.get("rank_biserial"),
                "effect_size_metric": "rank_biserial",
                "weighted_n": h2.get("weighted_n"),
            },
            "H3_Urgency_WLS_Regression": {
                "hypothesis": "H3: CTAS Urgency Score predicts LOS (WLS)",
                "model": h3.get("regression_type"),
                "r_squared": h3.get("r_squared"),
                "slope": h3.get("slope"),
                "decision": h3.get("decision"),
                "p_value": h3.get("p_value_slope"),
            },
            "H4_Age_Group_Difference": {
                "hypothesis": "H4: LOS differs across Broad Age Categories",
                "test": h4.get("test_name"),
                "decision": h4.get("decision"),
                "p_value": h4.get("p_value"),
                "degrees_of_freedom": h4.get("degrees_of_freedom"),
                "effect_size": h4.get("epsilon_squared"),
                "effect_size_metric": "epsilon_squared",
                "effect_size_magnitude": h4.get("effect_size_magnitude"),
                "weighted_n": h4.get("weighted_n"),
            },
            "H5_Sex_vs_Disposition": {
                "hypothesis": "H5: Sex and Visit Disposition are associated (Chi-Square)",
                "test": "Pearson Chi-Square Test of Independence",
                "decision": h5.get("results", {}).get("decision"),
                "p_value": h5.get("results", {}).get("p_value"),
                "chi2_statistic": h5.get("results", {}).get("chi2_statistic"),
                "degrees_of_freedom": h5.get("results", {}).get("degrees_of_freedom"),
                "effect_size": h5.get("cramers_v"),
                "effect_size_metric": "cramers_v",
                "effect_size_magnitude": h5.get("effect_size_magnitude"),
                "total_visits_analyzed": h5.get("total_visits_analyzed"),
            },
            "Resource_Burden": {
                "overall_erbi": erbi.get("overall_erbi_score")
            },
        }

        return {
            "success": True,
            "source": "SQLite Database (healthcare.db)",
            "alpha": ALPHA,
            "dashboard": dashboard_data,
            "summary_dashboard": dashboard_data,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(e)}")


@router.get("/methods")
async def get_statistical_methods() -> Dict[str, Any]:
    """
    GET /statistics/methods: the algorithms actually executed by the engine.
    Sourced from the central hypotheses_registry — cannot drift from the code.
    """
    return {"success": True, **methods_payload()}


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
