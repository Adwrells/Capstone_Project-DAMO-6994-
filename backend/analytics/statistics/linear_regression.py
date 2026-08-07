import math
from typing import List, Dict, Any

def linear_regression(x: List[float], y: List[float]) -> Dict[str, float]:
    if len(x) != len(y) or len(x) < 2: return {"slope": 0.0, "intercept": 0.0, "r_squared": 0.0, "correlation": 0.0, "p_value": 1.0}
    n = len(x)
    sum_x, sum_y = sum(x), sum(y)
    sum_xy = sum(x[i] * y[i] for i in range(n))
    sum_x2 = sum(xi ** 2 for xi in x)
    sum_y2 = sum(yi ** 2 for yi in y)
    denom = n * sum_x2 - sum_x ** 2
    if denom == 0: return {"slope": 0.0, "intercept": 0.0, "r_squared": 0.0, "correlation": 0.0, "p_value": 1.0}
    slope = (n * sum_xy - sum_x * sum_y) / denom
    intercept = (sum_y - slope * sum_x) / n
    num_corr = n * sum_xy - sum_x * sum_y
    denom_corr = math.sqrt((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2))
    r = num_corr / denom_corr if denom_corr != 0 else 0.0
    r_squared = r ** 2
    df = max(1, n - 2)
    t_stat = r * math.sqrt(df) / math.sqrt(max(1e-10, 1 - r_squared))
    p_val = max(0.0001, min(1.0, 2.0 * math.exp(-0.717 * abs(t_stat) - 0.416 * t_stat ** 2)))
    return {"slope": round(slope, 4), "intercept": round(intercept, 4), "r_squared": round(r_squared, 4), "correlation": round(r, 4), "p_value": round(p_val, 6)}

def regression_summary(x: List[float], y: List[float], x_label: str = "X", y_label: str = "Y") -> Dict[str, Any]:
    res = linear_regression(x, y)
    reject = res["p_value"] < 0.05
    return {
        **res, "n": len(x), "x_label": x_label, "y_label": y_label, "reject_null": reject,
        "decision": "Reject H₀" if reject else "Fail to Reject H₀",
        "interpretation": f"Significant linear relationship: slope={res['slope']:.4f} (R²={res['r_squared']:.4f}, p={res['p_value']:.4e})." if reject else "No significant linear relationship."
    }
