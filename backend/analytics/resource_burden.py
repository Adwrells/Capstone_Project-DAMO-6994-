"""
Healthcare Analytics Platform — Resource Burden & ERBI Engine
==============================================================
Authoritative implementation of the Estimated Resource Burden Index (ERBI).

Methodology & Formula:
----------------------
The Estimated Resource Burden Index (ERBI) is a derived proxy metric that combines
clinical acuity, duration of stay, and patient volume into an aggregate index:

    Raw Resource Burden = ctas_urgency_score × length_of_stay_hours × ed_visits
    ERBI Score          = Σ(Raw Resource Burden) / Σ(ed_visits)

Where:
    - ctas_urgency_score: CTAS clinical urgency integer score (1 = Resuscitation, 2 = Emergent, 3 = Urgent, etc.)
    - length_of_stay_hours: median length of stay in hours (median_length_of_stay_min / 60)
    - ed_visits: aggregate visit frequency count for the cohort stratum

This index measures the acuity-weighted patient-hours of care per visit, enabling
standardized comparisons of resource demand across triage acuity tiers, demographic
life-stages, and longitudinal fiscal years.
"""

from typing import Any, Dict, List, Optional
import pandas as pd
from backend.database.database_manager import db_manager


def compute_resource_burden_metrics(manager: Optional[Any] = None) -> Dict[str, Any]:
    """
    Computes canonical ERBI metrics directly from the ctas_triage analytical table.
    Returns overall ERBI score, triage-stratified breakdown, and age-stratified breakdown.
    """
    db = manager or db_manager
    df = db.read_sql(
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
        total_visits = int(group["ed_visits"].sum())
        total_burden = float(group["raw_resource_burden"].sum())
        weighted_erbi = (total_burden / total_visits) if total_visits > 0 else 0.0
        triage_erbi.append({
            "triage_level": str(level),
            "total_visits": total_visits,
            "avg_erbi_score": round(float(weighted_erbi), 2),
            "raw_burden_hours": round(total_burden, 2),
        })

    # Sort triage levels logically
    triage_order = [
        "CTAS I - Resuscitation",
        "CTAS II - Emergent",
        "CTAS III - Urgent",
        "Less urgent",
        "Non-urgent",
    ]
    triage_erbi.sort(key=lambda x: triage_order.index(x["triage_level"]) if x["triage_level"] in triage_order else 99)

    # Calculate ERBI by Age Category
    age_erbi = []
    for age_cat, group in df.groupby("age_broad_category"):
        total_visits = int(group["ed_visits"].sum())
        total_burden = float(group["raw_resource_burden"].sum())
        weighted_erbi = (total_burden / total_visits) if total_visits > 0 else 0.0
        age_erbi.append({
            "age_category": str(age_cat),
            "total_visits": total_visits,
            "avg_erbi_score": round(float(weighted_erbi), 2),
            "raw_burden_hours": round(total_burden, 2),
        })

    # Global ERBI KPI
    overall_visits = int(df["ed_visits"].sum())
    overall_burden = float(df["raw_resource_burden"].sum())
    overall_erbi = (overall_burden / overall_visits) if overall_visits > 0 else 0.0

    return {
        "metric_name": "Estimated Resource Burden Index (ERBI)",
        "formula": "ERBI = Σ(ctas_urgency_score × length_of_stay_hours × ed_visits) / Σ(ed_visits)",
        "units": "Acuity-weighted patient hours per visit",
        "overall_erbi_score": round(float(overall_erbi), 2),
        "total_visits_analyzed": overall_visits,
        "total_burden_hours": round(overall_burden, 2),
        "triage_level_erbi": triage_erbi,
        "age_category_erbi": age_erbi,
    }


def compute_erbi_from_records(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    In-memory helper for computing ERBI from arbitrary record dicts (e.g. filtered views).
    Uses the exact same canonical formula: urgency × los_hours × ed_visits / total_visits.
    """
    if not records:
        return {"error": "No records provided for ERBI calculation."}

    total_visits = 0
    total_burden = 0.0
    triage_groups: Dict[str, Dict[str, float]] = {}
    age_groups: Dict[str, Dict[str, float]] = {}

    for r in records:
        urgency = float(r.get("ctas_urgency_score") or 1.0)
        los_hours = float(r.get("length_of_stay_hours") or (float(r.get("median_length_of_stay_min") or 0.0) / 60.0))
        visits = float(r.get("ed_visits") or r.get("total_visits") or 0.0)
        raw_burden = urgency * los_hours * visits

        total_visits += int(visits)
        total_burden += raw_burden

        level = str(r.get("triage_level") or "Unknown")
        if level != "Unknown":
            triage_groups.setdefault(level, {"visits": 0.0, "burden": 0.0})
            triage_groups[level]["visits"] += visits
            triage_groups[level]["burden"] += raw_burden

        cat = str(r.get("age_broad_category") or r.get("age_group") or "Unknown")
        if cat != "Unknown":
            age_groups.setdefault(cat, {"visits": 0.0, "burden": 0.0})
            age_groups[cat]["visits"] += visits
            age_groups[cat]["burden"] += raw_burden

    overall_erbi = (total_burden / total_visits) if total_visits > 0 else 0.0

    return {
        "metric_name": "Estimated Resource Burden Index (ERBI)",
        "formula": "ERBI = Σ(ctas_urgency_score × length_of_stay_hours × ed_visits) / Σ(ed_visits)",
        "overall_erbi_score": round(overall_erbi, 2),
        "total_visits_analyzed": total_visits,
        "by_triage_level": [
            {
                "triage_level": lvl,
                "total_visits": int(d["visits"]),
                "avg_erbi_score": round(d["burden"] / d["visits"], 2) if d["visits"] > 0 else 0.0,
            }
            for lvl, d in sorted(triage_groups.items())
        ],
        "by_age_category": [
            {
                "age_category": c,
                "total_visits": int(d["visits"]),
                "avg_erbi_score": round(d["burden"] / d["visits"], 2) if d["visits"] > 0 else 0.0,
            }
            for c, d in sorted(age_groups.items())
        ],
    }
