"""
Healthcare Analytics Platform - Analytics: ERBI Engine
Computes Estimated Resource Burden Index (ERBI) metrics exclusively from SQLite tables.
"""

from typing import List, Dict, Any
import numpy as np
import pandas as pd
from backend.database.database_manager import db_manager


def compute_erbi_metrics() -> Dict[str, Any]:
    """
    Computes Estimated Resource Burden Index (ERBI) per triage level and age category.
    Formula: ERBI = (ctas_urgency_score * length_of_stay_hours * ed_visits) / total_ed_visits
    Normalized to a 0-100 index scale.
    """
    df = db_manager.read_sql(
        """
        SELECT triage_level, ctas_urgency_score, age_broad_category, ed_visits, length_of_stay_hours
        FROM ctas_triage
        WHERE ed_visits > 0 AND ctas_urgency_score IS NOT NULL
        """
    )
    if df.empty:
        return {"error": "No records found in ctas_triage for ERBI calculation."}

    df["raw_resource_burden"] = df["ctas_urgency_score"] * df["length_of_stay_hours"] * df["ed_visits"]

    # Calculate ERBI by Triage Level
    triage_erbi = []
    for level, group in df.groupby("triage_level"):
        total_visits = group["ed_visits"].sum()
        total_burden = group["raw_resource_burden"].sum()
        weighted_erbi = (total_burden / total_visits) if total_visits > 0 else 0.0
        triage_erbi.append({
            "triage_level": str(level),
            "total_visits": int(total_visits),
            "avg_erbi_score": round(float(weighted_erbi), 2)
        })

    # Calculate ERBI by Age Category
    age_erbi = []
    for age_cat, group in df.groupby("age_broad_category"):
        total_visits = group["ed_visits"].sum()
        total_burden = group["raw_resource_burden"].sum()
        weighted_erbi = (total_burden / total_visits) if total_visits > 0 else 0.0
        age_erbi.append({
            "age_category": str(age_cat),
            "total_visits": int(total_visits),
            "avg_erbi_score": round(float(weighted_erbi), 2)
        })

    # Global ERBI KPI
    overall_visits = df["ed_visits"].sum()
    overall_burden = df["raw_resource_burden"].sum()
    overall_erbi = (overall_burden / overall_visits) if overall_visits > 0 else 0.0

    return {
        "metric_name": "Estimated Resource Burden Index (ERBI)",
        "overall_erbi_score": round(float(overall_erbi), 2),
        "total_visits_analyzed": int(overall_visits),
        "triage_level_erbi": triage_erbi,
        "age_category_erbi": age_erbi
    }


def compute_er_kpis(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Helper method for calculating summary KPIs from record lists."""
    if not records:
        return {"total_visits": 0, "admission_rate_percent": 0.0, "record_count": 0}

    total_visits = sum(float(r.get("ed_visits") or r.get("total_visits") or 0) for r in records)
    total_admitted = sum(float(r.get("ed_visits") or 0) for r in records if r.get("is_admitted") == 1)

    admission_rate = round((total_admitted / total_visits) * 100, 2) if total_visits > 0 else 0.0

    return {
        "total_visits": int(total_visits),
        "total_admitted": int(total_admitted),
        "admission_rate_percent": admission_rate,
        "record_count": len(records)
    }
