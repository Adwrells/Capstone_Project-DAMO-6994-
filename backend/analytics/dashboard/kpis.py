from typing import List, Dict, Any
from backend.analytics.resource_burden import compute_erbi_from_records

# Canonical in-memory ERBI function
compute_erbi = compute_erbi_from_records


def compute_er_kpis(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not records:
        return {"total_visits": 0, "total_admitted": 0, "admission_rate_percent": 0.0, "record_count": 0}
    total_visits = sum(float(r.get("total_ed_visits") or r.get("visit_count") or r.get("ed_visits") or 0) for r in records)
    total_admitted = sum(float(r.get("admitted_visits") or 0) for r in records)
    admission_rate = round((total_admitted / total_visits) * 100, 2) if total_visits > 0 else 0.0
    return {
        "total_visits": int(total_visits),
        "total_admitted": int(total_admitted),
        "admission_rate_percent": admission_rate,
        "record_count": len(records),
    }


def compute_problem_rank(records: List[Dict[str, Any]], count_key: str = "ed_visits") -> List[Dict[str, Any]]:
    sorted_records = sorted(records, key=lambda r: float(r.get(count_key) or 0), reverse=True)
    for rank, r in enumerate(sorted_records, start=1):
        r["problem_rank"] = rank
    return sorted_records


def compute_population_category(age_group: str) -> str:
    ag = str(age_group).strip().lower()
    if any(k in ag for k in ("0-19", "0–19", "under 20", "pediatric", "youth")):
        return "Pediatric & Youth"
    if any(k in ag for k in ("20-44", "20–44", "young adult")):
        return "Young Adult"
    if any(k in ag for k in ("45-64", "45–64", "middle", "middle adult")):
        return "Middle Adult"
    if any(k in ag for k in ("65", "older", "senior", "elderly")):
        return "Older Adult"
    return "Unknown"
