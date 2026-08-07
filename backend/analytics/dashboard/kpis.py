from typing import List, Dict, Any

def compute_erbi(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not records:
        return {"error": "No records provided for ERBI calculation."}
    for r in records:
        urgency = float(r.get("ctas_urgency_score") or 1.0)
        los_hours = float(r.get("length_of_stay_hours") or 0.0)
        visits = float(r.get("ed_visits") or 0.0)
        r["_raw_burden"] = urgency * los_hours * visits

    overall_visits = sum(float(r.get("ed_visits") or 0) for r in records)
    overall_burden = sum(r["_raw_burden"] for r in records)
    overall_erbi = overall_burden / overall_visits if overall_visits > 0 else 0.0

    triage_groups: Dict[str, Dict[str, float]] = {}
    for r in records:
        level = str(r.get("triage_level", "Unknown"))
        triage_groups.setdefault(level, {"visits": 0.0, "burden": 0.0})
        triage_groups[level]["visits"] += float(r.get("ed_visits") or 0)
        triage_groups[level]["burden"] += r["_raw_burden"]

    triage_erbi = [
        {"triage_level": level, "total_visits": int(data["visits"]), "erbi_score": round(data["burden"] / data["visits"], 2) if data["visits"] > 0 else 0.0}
        for level, data in sorted(triage_groups.items())
    ]

    age_groups: Dict[str, Dict[str, float]] = {}
    for r in records:
        cat = str(r.get("age_broad_category", "Unknown"))
        age_groups.setdefault(cat, {"visits": 0.0, "burden": 0.0})
        age_groups[cat]["visits"] += float(r.get("ed_visits") or 0)
        age_groups[cat]["burden"] += r["_raw_burden"]

    age_erbi = [
        {"age_category": cat, "total_visits": int(data["visits"]), "erbi_score": round(data["burden"] / data["visits"], 2) if data["visits"] > 0 else 0.0}
        for cat, data in sorted(age_groups.items())
    ]

    return {
        "metric": "Estimated Resource Burden Index (ERBI)",
        "formula": "ERBI = (ctas_urgency_score × los_hours × ed_visits) / total_ed_visits",
        "overall_erbi_score": round(overall_erbi, 2),
        "total_visits_analyzed": int(overall_visits),
        "by_triage_level": triage_erbi,
        "by_age_category": age_erbi,
    }

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
