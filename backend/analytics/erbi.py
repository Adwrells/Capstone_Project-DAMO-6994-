"""
Healthcare Analytics Platform - Analytics: ERBI Engine
Maintains backward compatibility by delegating to the canonical resource_burden module.
"""

from typing import List, Dict, Any
from backend.analytics.resource_burden import (
    compute_resource_burden_metrics,
    compute_erbi_from_records,
)

# Canonical export
compute_erbi_metrics = compute_resource_burden_metrics


def compute_er_kpis(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Helper method for calculating summary KPIs from record lists."""
    if not records:
        return {"total_visits": 0, "total_admitted": 0, "admission_rate_percent": 0.0, "record_count": 0}

    total_visits = sum(float(r.get("ed_visits") or r.get("total_visits") or 0) for r in records)
    total_admitted = sum(float(r.get("ed_visits") or 0) for r in records if r.get("is_admitted") == 1)

    admission_rate = round((total_admitted / total_visits) * 100, 2) if total_visits > 0 else 0.0

    return {
        "total_visits": int(total_visits),
        "total_admitted": int(total_admitted),
        "admission_rate_percent": admission_rate,
        "record_count": len(records),
    }
