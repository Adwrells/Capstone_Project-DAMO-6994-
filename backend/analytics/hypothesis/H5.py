from typing import Any, Dict, List, Sequence
import numpy as np
from scipy import stats as sstats
 
STATISTICAL_METHOD = "Mann-Kendall Trend Test + Simple Exponential Smoothing (SES) Forecast"
 
 
def mann_kendall_trend_test(series: Sequence[float]) -> Dict[str, Any]:
    """Non-parametric test for a monotonic trend in an ordered (time) series."""
    x = np.asarray(series, dtype=float)
    n = len(x)
    if n < 4:
        return {"error": "Mann-Kendall requires at least 4 time points."}
 
    s = 0.0
    for i in range(n - 1):
        s += np.sum(np.sign(x[i + 1:] - x[i]))
 
    vals, counts = np.unique(x, return_counts=True)
    tie_term = np.sum(counts * (counts - 1) * (2 * counts + 5))
    var_s = (n * (n - 1) * (2 * n + 5) - tie_term) / 18.0
    var_s = max(var_s, 1e-12)
 
    if s > 0:
        z = (s - 1) / np.sqrt(var_s)
    elif s < 0:
        z = (s + 1) / np.sqrt(var_s)
    else:
        z = 0.0
    p_value = float(2 * (1 - sstats.norm.cdf(abs(z))))
    tau = float(s / (0.5 * n * (n - 1)))
 
    reject = p_value < 0.05
    if reject:
        direction = "increasing" if s > 0 else "decreasing"
    else:
        direction = "no significant trend"
 
    return {
        "s_statistic": float(s), "variance_s": float(var_s), "z_score": round(float(z), 4),
        "tau": round(tau, 4), "p_value": p_value, "n": n, "trend_direction": direction,
        "reject_null": reject, "decision": "Reject Null Hypothesis" if reject else "Fail to Reject Null Hypothesis",
    }
 
 
def ses_forecast(series: Sequence[float], steps: int = 2, alpha: float = None) -> Dict[str, Any]:
    """Simple Exponential Smoothing with a flat multi-step forecast and 95%
    prediction intervals that widen with horizon. If ``alpha`` is not supplied,
    it is chosen by grid search to minimize in-sample SSE (0.05-0.95 step 0.05).
    """
    x = np.asarray(series, dtype=float)
    n = len(x)
 
    def fit(a):
        level = x[0]
        fitted = [level]
        for t in range(1, n):
            level = a * x[t - 1] + (1 - a) * level
            fitted.append(level)
        resid = x - np.array(fitted)
        return fitted, resid
 
    if alpha is None:
        best_a, best_sse, best_fitted, best_resid = 0.3, np.inf, None, None
        for a in np.arange(0.05, 1.0, 0.05):
            fitted, resid = fit(a)
            sse = float(np.sum(resid ** 2))
            if sse < best_sse:
                best_a, best_sse, best_fitted, best_resid = a, sse, fitted, resid
        alpha, fitted, resid = best_a, best_fitted, best_resid
    else:
        fitted, resid = fit(alpha)
 
    sigma = float(np.std(resid, ddof=1)) if n > 2 else float(np.std(resid))
    last_level = alpha * x[-1] + (1 - alpha) * fitted[-1]
 
    forecasts, intervals = [], []
    for h in range(1, steps + 1):
        se_h = sigma * np.sqrt(1 + (h - 1) * alpha ** 2)
        forecasts.append(round(float(last_level), 2))
        intervals.append((round(float(last_level - 1.96 * se_h), 2), round(float(last_level + 1.96 * se_h), 2)))
 
    return {"alpha": round(float(alpha), 2), "sigma": round(sigma, 2),
            "forecasts": forecasts, "forecast_intervals_95": intervals, "fitted_values": [round(v, 2) for v in fitted]}
 
 
def run(
    fiscal_years: List[str],
    values: List[float],
    metric_name: str = "Estimated ED Resource Burden Index (ERBI)",
    forecast_steps: int = 2,
) -> Dict[str, Any]:
    """H5: what long-term trend exists in the given fiscal-year metric series,
    and what does Simple Exponential Smoothing project forward?
 
    ``fiscal_years`` and ``values`` must already be sorted chronologically.
    """
    if len(fiscal_years) != len(values):
        return {"error": "fiscal_years and values must be the same length."}
 
    mk = mann_kendall_trend_test(values)
    if "error" in mk:
        return mk
    ses = ses_forecast(values, steps=forecast_steps)
    reject = mk["reject_null"]
 
    forecast_labels = []
    if fiscal_years:
        try:
            last_start = int(fiscal_years[-1].split("-")[0])
            forecast_labels = [f"{last_start + i}-{last_start + i + 1}" for i in range(1, forecast_steps + 1)]
        except (ValueError, IndexError):
            forecast_labels = [f"FY+{i}" for i in range(1, forecast_steps + 1)]
 
    return {
        "hypothesis": "H5",
        "research_question": f"What long-term trend is observed in the {metric_name} across fiscal years, "
                              "and what does that trend project forward?",
        "null_hypothesis": f"There is no monotonic trend in {metric_name} across fiscal years.",
        "alternative_hypothesis": f"There is a monotonic trend in {metric_name} across fiscal years.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {
            "note": "Mann-Kendall is distribution-free and does not require normality; it assumes "
                    "observations are recorded at regular, ordered intervals (fiscal years here).",
            "n_periods": mk["n"],
        },
        "results": {
            "mann_kendall_tau": mk["tau"], "s_statistic": mk["s_statistic"], "z_score": mk["z_score"],
            "p_value": mk["p_value"], "trend_direction": mk["trend_direction"],
            "reject_null": reject, "decision": mk["decision"],
            "ses_alpha": ses["alpha"], "ses_sigma": ses["sigma"],
            "forecast": [
                {"period": label, "forecast": val, "ci_95_lower": ci[0], "ci_95_upper": ci[1]}
                for label, val, ci in zip(forecast_labels, ses["forecasts"], ses["forecast_intervals_95"])
            ],
        },
        "interpretation": f"A statistically significant {mk['trend_direction']} trend is detected in {metric_name} "
                           f"across fiscal years (tau={mk['tau']}, p={mk['p_value']:.4g})." if reject
                           else f"No statistically significant trend detected in {metric_name} across fiscal years.",
        "clinical_insight": "Sustained growth in aggregate resource burden reflects combined shifts in visit "
                             "volume and reported LOS over time." if reject else "No clear long-term directional shift.",
        "operational_recommendation": "Use the SES forecast and its widening prediction interval as a baseline "
                                       "for near-term capacity planning, refreshed as new fiscal-year data arrives."
                                       if reject else "Trend-based forecasting is not indicated; monitor for emerging patterns.",
        "series": [{"fiscal_year": fy, "value": round(float(v), 2)} for fy, v in zip(fiscal_years, values)],
    }
 
 
if __name__ == "__main__":
    import json
    import pandas as pd
 
    df = pd.read_csv("/mnt/project/ED_Visits_Cleaned.csv")
    by_fy = (
        df.groupby(["fiscal_year", "fiscal_year_start"], as_index=False)
        .agg(erbi=("erbi", "sum"))
        .sort_values("fiscal_year_start")
    )
 
    result = run(by_fy["fiscal_year"].tolist(), by_fy["erbi"].astype(float).tolist())
    print(json.dumps(result, indent=2, default=str))