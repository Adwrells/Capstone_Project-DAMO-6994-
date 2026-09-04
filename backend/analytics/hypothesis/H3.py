from typing import Dict, Any, List, Optional
from backend.analytics.statistics.linear_regression import regression_summary
from backend.analytics.statistics.assumptions import check_normality
 
def run(ctas_scores: List[float], los_values: List[float], weights: Optional[List[float]] = None) -> Dict[str, Any]:
    if len(ctas_scores) < 5 or len(los_values) < 5:
        return {"error": "H3 requires at least 5 data points."}
    normality = check_normality(los_values, "LOS Distribution")
    reg = regression_summary(ctas_scores, los_values, "CTAS Urgency Score", "Median LOS (min)", weights=weights)
    reject = reg["reject_null"]
    method_name = "Weighted Least Squares Linear Regression" if weights is not None else "Ordinary Least Squares Linear Regression"
    return {
        "hypothesis": "H3",
        "research_question": "Does CTAS Urgency Score significantly predict LOS?",
        "null_hypothesis": "CTAS urgency score has no linear relationship with LOS.",
        "alternative_hypothesis": "CTAS urgency score predicts LOS.",
        "statistical_method": method_name,
        "assumption_checks": {"normality_of_response": normality},
        "results": {
            "slope": reg["slope"],
            "intercept": reg["intercept"],
            "r_squared": reg["r_squared"],
            "pearson_correlation": reg["correlation"],
            "p_value": reg["p_value"],
            "reject_null": reject,
            "decision": reg["decision"]
        },
        "interpretation": reg["interpretation"],
        "clinical_insight": f"Urgency score explains {reg['r_squared']*100:.1f}% of variance." if reject else "No predictive relationship.",
        "operational_recommendation": "Incorporate CTAS score into capacity planning." if reject else "Investigate other predictors.",
        "n": reg["n"],
    }
 