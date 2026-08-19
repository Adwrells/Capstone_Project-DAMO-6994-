from typing import Any, Dict, List, Optional, Sequence
import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy import stats as sstats
 
STATISTICAL_METHOD = "Weighted Least Squares (WLS) Regression"
 
 
def check_normality(data: Sequence[float], name: str, max_n: int = 5000) -> Dict[str, Any]:
    data = np.asarray(data, dtype=float)
    data = data[~np.isnan(data)]
    if len(data) < 3:
        return {"group": name, "n": len(data), "test": "Shapiro-Wilk", "is_normal": None, "note": "insufficient n"}
    sample = data if len(data) <= max_n else np.random.default_rng(42).choice(data, max_n, replace=False)
    stat, p = sstats.shapiro(sample)
    return {"group": name, "n": len(data), "test": "Shapiro-Wilk",
            "statistic": round(float(stat), 4), "p_value": round(float(p), 4), "is_normal": bool(p > 0.05)}
 
 
def run(
    rows: List[Dict[str, Any]],
    outcome_col: str = "median_los_hours",
    weight_col: str = "ed_visits",
    categorical_predictors: Optional[List[str]] = None,
    reference_levels: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """H3: does reported median ED LOS differ across case-mix strata (CTAS triage
    level and visit disposition), estimated jointly via WLS?
 
    ``rows`` is a list of aggregate records (one per unique combination of the
    categorical predictors), each with the outcome, a weight (visit count), and
    the categorical predictor columns. Weighting by visit count means larger,
    more reliable strata pull more weight in the fit — the standard treatment
    for regression on aggregate/grouped data.
    """
    categorical_predictors = categorical_predictors or ["triage_level", "visit_disposition"]
    if len(rows) < len(categorical_predictors) + 3:
        return {"error": "H3 requires more aggregate rows than predictors to fit."}
 
    df = pd.DataFrame(rows)
    y = df[outcome_col].astype(float)
    w = df[weight_col].astype(float).replace(0, 1.0)  # avoid zero-weight rows
 
    normality = check_normality(y.tolist(), "LOS Distribution")
 
    X_parts = []
    for col in categorical_predictors:
        ref = (reference_levels or {}).get(col, sorted(df[col].unique())[0])
        cats = pd.Categorical(df[col], categories=[ref] + [c for c in sorted(df[col].unique()) if c != ref])
        dummies = pd.get_dummies(cats, prefix=col, drop_first=True).astype(float)
        X_parts.append(dummies)
    X = pd.concat(X_parts, axis=1)
    X = sm.add_constant(X)
 
    model = sm.WLS(y, X, weights=w).fit()
    reject = bool(model.f_pvalue < 0.05)
 
    coefficients = []
    for name in X.columns:
        if name == "const":
            continue
        ci_lo, ci_hi = model.conf_int().loc[name]
        coefficients.append({
            "predictor": name, "coefficient": round(float(model.params[name]), 4),
            "std_error": round(float(model.bse[name]), 4),
            "ci_lower_95": round(float(ci_lo), 4), "ci_upper_95": round(float(ci_hi), 4),
            "p_value": float(model.pvalues[name]), "significant": bool(model.pvalues[name] < 0.05),
        })
 
    return {
        "hypothesis": "H3",
        "research_question": "Does reported median ED length of stay differ across CTAS triage level and "
                              "disposition strata, jointly?",
        "null_hypothesis": "None of the CTAS triage level or disposition predictors are associated with LOS.",
        "alternative_hypothesis": "At least one CTAS triage level or disposition predictor is associated with LOS.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {"normality_of_response": normality},
        "results": {
            "intercept": round(float(model.params["const"]), 4),
            "r_squared": round(float(model.rsquared), 4),
            "adj_r_squared": round(float(model.rsquared_adj), 4),
            "f_statistic": round(float(model.fvalue), 4),
            "f_p_value": float(model.f_pvalue),
            "encoded_predictors": len(coefficients),
            "aggregate_observations": int(len(df)),
            "reject_null": reject,
            "decision": "Reject Null Hypothesis" if reject else "Fail to Reject Null Hypothesis",
        },
        "interpretation": f"The model explains {model.rsquared_adj*100:.1f}% of weighted variance in reported "
                           "median LOS; case-mix strata are jointly significant predictors." if reject
                           else "Case-mix strata are not jointly significant predictors of LOS.",
        "clinical_insight": "Triage level and disposition pathway jointly explain most of the variation in "
                             "reported median LOS at the aggregate level." if reject else "No joint predictive relationship.",
        "operational_recommendation": "Use triage/disposition strata coefficients to weight capacity-planning "
                                       "demand forecasts by expected case mix." if reject else "Investigate other predictors.",
        "coefficients": coefficients,
        "n": int(len(df)),
    }
 

if __name__ == "__main__":
    import json
 
    raw = pd.read_csv("/mnt/project/ED_Visits_Cleaned.csv")
    agg = raw.groupby(["triage_level", "visit_disposition"], as_index=False).agg(
        median_los_hours=("median_los_hours", "median"),
        ed_visits=("ed_visits", "sum"),
    )
 
    result = run(agg.to_dict(orient="records"))
    print(json.dumps(result, indent=2, default=str))