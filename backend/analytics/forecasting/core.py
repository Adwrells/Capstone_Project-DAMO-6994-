"""
Healthcare Analytics Platform - Analytics: Forecasting Engine
Computes Simple Exponential Smoothing (SES) forecasts with confidence intervals
directly from SQLite database tables.
"""

from typing import List, Dict, Any
import numpy as np
import pandas as pd
from backend.database.database_manager import db_manager


def exponential_smoothing_forecast(
    series: List[float],
    alpha: float = 0.3,
    horizon: int = 5,
    confidence_level: float = 0.95
) -> Dict[str, Any]:
    """
    Performs Simple Exponential Smoothing (SES) forecasting with 95% confidence intervals.
    """
    if not series or len(series) < 2:
        return {
            "error": "Forecasting requires at least 2 time series data points.",
            "forecast": [],
            "confidence_intervals": []
        }

    y = np.array(series, dtype=float)
    n = len(y)

    # 1. Compute fitted values level
    level = y[0]
    fitted = np.zeros(n)
    fitted[0] = level

    for t in range(1, n):
        level = alpha * y[t] + (1 - alpha) * level
        fitted[t] = level

    # 2. Residuals & residual variance
    residuals = y[1:] - fitted[:-1]
    rmse = float(np.sqrt(np.mean(residuals ** 2))) if len(residuals) > 0 else 0.0

    # 3. Generate point forecasts for horizon h
    last_level = float(level)
    point_forecasts = [round(last_level, 2) for _ in range(horizon)]

    # 4. Compute confidence intervals (z = 1.96 for 95%)
    z_score = 1.96 if confidence_level == 0.95 else 2.576
    confidence_intervals = []

    for h in range(1, horizon + 1):
        # Forecast variance increases with horizon h
        se_h = rmse * np.sqrt(1 + (h - 1) * (alpha ** 2))
        lower = round(max(0.0, last_level - z_score * se_h), 2)
        upper = round(last_level + z_score * se_h, 2)
        confidence_intervals.append({
            "step": h,
            "point_forecast": round(last_level, 2),
            "lower_bound": lower,
            "upper_bound": upper,
            "se": round(float(se_h), 2)
        })

    return {
        "alpha": alpha,
        "horizon": horizon,
        "last_observed_value": round(float(y[-1]), 2),
        "last_level": round(last_level, 2),
        "rmse": round(rmse, 2),
        "point_forecasts": point_forecasts,
        "confidence_intervals": confidence_intervals
    }


def run_ed_visits_forecasting(horizon: int = 5) -> Dict[str, Any]:
    """
    Queries annual ED visit totals from SQLite and generates Simple Exponential Smoothing forecast.
    """
    df = db_manager.read_sql(
        """
        SELECT fiscal_year_start, SUM(ed_visits) as total_visits
        FROM age_sex
        GROUP BY fiscal_year_start
        ORDER BY fiscal_year_start ASC
        """
    )
    if df.empty or len(df) < 2:
        return {"error": "Insufficient data for forecasting in SQLite."}

    years = df["fiscal_year_start"].tolist()
    visits = df["total_visits"].astype(float).tolist()

    forecast_res = exponential_smoothing_forecast(visits, alpha=0.3, horizon=horizon)
    future_years = [years[-1] + i for i in range(1, horizon + 1)]

    return {
        "historical_years": years,
        "historical_visits": visits,
        "forecast_years": future_years,
        "forecast_results": forecast_res
    }
