"""Forecasting Submodule

Re-exports the SES forecasting engine so `from backend.analytics.forecasting import ...`
resolves. The engine lives in core.py; this package previously shadowed a sibling
forecasting.py module, which made both names unimportable.
"""

from backend.analytics.forecasting.core import (
    exponential_smoothing_forecast,
    run_ed_visits_forecasting,
)

__all__ = ["exponential_smoothing_forecast", "run_ed_visits_forecasting"]
