"""
Healthcare Analytics Platform - Analytics: Trend Analysis Engine
Computes Mann-Kendall Trend Test and Sen's Slope Estimator for temporal time series
directly from SQLite database tables.
"""

import math
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import pandas as pd
from backend.database.database_manager import db_manager

try:
    from scipy.stats import norm
    SCIPY_AVAILABLE = True
except ImportError:
    SCIPY_AVAILABLE = False


def _norm_cdf(z: float) -> float:
    """Standard normal CDF approximation if scipy is not installed."""
    if SCIPY_AVAILABLE:
        return float(norm.cdf(z))
    # Error function approximation of normal CDF
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def mann_kendall_test(series: List[float], alpha: float = 0.05) -> Dict[str, Any]:
    """
    Performs the Mann-Kendall Non-Parametric Trend Test on a time series sequence.
    Returns Kendall's S statistic, Variance Var(S), Z-score, p-value, Sen's slope,
    and trend classification ('increasing', 'decreasing', 'no trend').
    """
    n = len(series)
    if n < 3:
        return {
            "error": "Mann-Kendall test requires at least 3 data points.",
            "n": n,
            "trend": "insufficient data"
        }

    x = np.array(series, dtype=float)

    # 1. Calculate S statistic
    s = 0
    for k in range(n - 1):
        for j in range(k + 1, n):
            diff = x[j] - x[k]
            if diff > 0:
                s += 1
            elif diff < 0:
                s -= 1

    # 2. Calculate Variance Var(S) with tie handling
    unique_x, counts = np.unique(x, return_counts=True)
    g = len(unique_x)

    if n == g:  # No ties
        var_s = (n * (n - 1) * (2 * n + 5)) / 18.0
    else:  # Ties exist
        term1 = n * (n - 1) * (2 * n + 5)
        term2 = np.sum(counts * (counts - 1) * (2 * counts + 5))
        var_s = (term1 - term2) / 18.0

    # 3. Calculate Z-score
    if s > 0:
        z = (s - 1) / np.sqrt(var_s) if var_s > 0 else 0.0
    elif s < 0:
        z = (s + 1) / np.sqrt(var_s) if var_s > 0 else 0.0
    else:
        z = 0.0

    # 4. Calculate two-tailed p-value
    p_value = float(2 * (1 - _norm_cdf(abs(z))))

    # 5. Calculate Sen's Slope
    slopes = []
    for k in range(n - 1):
        for j in range(k + 1, n):
            slopes.append((x[j] - x[k]) / (j - k))
    sens_slope = float(np.median(slopes)) if slopes else 0.0

    # 6. Trend classification
    reject_null = p_value < alpha
    if reject_null and z > 0:
        trend = "increasing"
    elif reject_null and z < 0:
        trend = "decreasing"
    else:
        trend = "no trend"

    return {
        "n_periods": n,
        "s_statistic": int(s),
        "var_s": round(float(var_s), 4),
        "z_score": round(float(z), 4),
        "p_value": float(p_value),
        "sens_slope": round(sens_slope, 4),
        "alpha": alpha,
        "reject_null": reject_null,
        "trend": trend,
        "decision": "Reject H₀ (Significant Trend)" if reject_null else "Fail to Reject H₀ (No Significant Trend)"
    }


def run_ed_visits_trend_analysis() -> Dict[str, Any]:
    """
    Queries annual ED visit volumes from SQLite database and performs Mann-Kendall trend test.
    """
    df = db_manager.read_sql(
        """
        SELECT fiscal_year_start, SUM(ed_visits) as total_visits
        FROM age_sex
        GROUP BY fiscal_year_start
        ORDER BY fiscal_year_start ASC
        """
    )
    if df.empty or len(df) < 3:
        return {"error": "Insufficient time series data in SQLite."}

    years = df["fiscal_year_start"].tolist()
    visits = df["total_visits"].astype(float).tolist()

    mk_result = mann_kendall_test(visits)

    return {
        "dataset": "Annual Total Emergency Department Visits",
        "years": years,
        "visits": visits,
        "mann_kendall_result": mk_result
    }
