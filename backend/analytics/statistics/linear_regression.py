import math
from typing import List, Dict, Any

from .weighted import student_t_sf

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
    p_val = min(1.0, 2.0 * student_t_sf(abs(t_stat), df))
    return {"slope": round(slope, 4), "intercept": round(intercept, 4), "r_squared": round(r_squared, 4), "correlation": round(r, 4), "p_value": p_val, "t_statistic": round(t_stat, 4), "degrees_of_freedom": df}

def weighted_linear_regression(x: List[float], y: List[float], weights: List[float] = None) -> Dict[str, Any]:
    if weights is None:
        return linear_regression(x, y)
    if len(x) != len(y) or len(x) != len(weights) or len(x) < 2:
        return {"slope": 0.0, "intercept": 0.0, "r_squared": 0.0, "correlation": 0.0, "p_value": 1.0, "t_statistic": 0.0, "degrees_of_freedom": 1}
    
    w_sum = sum(weights)
    if w_sum <= 0:
        return linear_regression(x, y)
        
    x_bar = sum(w * xi for w, xi in zip(weights, x)) / w_sum
    y_bar = sum(w * yi for w, yi in zip(weights, y)) / w_sum
    
    ss_xx = sum(w * (xi - x_bar)**2 for w, xi in zip(weights, x))
    ss_xy = sum(w * (xi - x_bar) * (yi - y_bar) for w, xi, yi in zip(weights, x, y))
    ss_yy = sum(w * (yi - y_bar)**2 for w, yi in zip(weights, y))
    
    if ss_xx == 0:
        return {"slope": 0.0, "intercept": y_bar, "r_squared": 0.0, "correlation": 0.0, "p_value": 1.0, "t_statistic": 0.0, "degrees_of_freedom": 1}
        
    slope = ss_xy / ss_xx
    intercept = y_bar - slope * x_bar
    
    r_squared = (ss_xy ** 2) / (ss_xx * ss_yy) if (ss_xx * ss_yy) > 0 else 0.0
    r = math.copysign(math.sqrt(max(0.0, min(1.0, r_squared))), ss_xy)
    
    n = len(x)
    df = max(1, n - 2)
    ss_res = sum(w * (yi - (intercept + slope * xi))**2 for w, xi, yi in zip(weights, x, y))
    mse = ss_res / df if df > 0 else 0.0
    se_slope = math.sqrt(mse / ss_xx) if ss_xx > 0 else 0.0
    t_stat = slope / se_slope if se_slope > 0 else 0.0
    p_val = min(1.0, 2.0 * student_t_sf(abs(t_stat), df))
    
    return {
        "slope": round(slope, 4),
        "intercept": round(intercept, 4),
        "r_squared": round(r_squared, 4),
        "correlation": round(r, 4),
        "p_value": p_val,
        "t_statistic": round(t_stat, 4),
        "degrees_of_freedom": df,
        "total_weight": round(w_sum, 2)
    }

def regression_summary(x: List[float], y: List[float], x_label: str = "X", y_label: str = "Y", weights: List[float] = None) -> Dict[str, Any]:
    res = weighted_linear_regression(x, y, weights) if weights is not None else linear_regression(x, y)
    reject = res["p_value"] < 0.05
    return {
        **res, "n": len(x), "x_label": x_label, "y_label": y_label, "reject_null": reject,
        "decision": "Reject H₀" if reject else "Fail to Reject H₀",
        "interpretation": f"Significant linear relationship: slope={res['slope']:.4f} (R²={res['r_squared']:.4f}, p={res['p_value']:.4e})." if reject else "No significant linear relationship."
    }
