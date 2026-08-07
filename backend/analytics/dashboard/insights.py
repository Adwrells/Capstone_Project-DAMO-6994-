from typing import Dict, Any, List, Optional

def generate_kpi_insight(kpis: Dict[str, Any]) -> str:
    total = kpis.get("total_visits", 0)
    rate = kpis.get("admission_rate_percent", 0.0)
    return (
        f"Across {total:,} emergency department visits analyzed, the overall admission rate "
        f"stands at {rate:.1f}%, indicating that {100 - rate:.1f}% of patients were discharged."
    )

def generate_erbi_insight(erbi: Dict[str, Any]) -> str:
    overall = erbi.get("overall_erbi_score", 0.0)
    triage_data = erbi.get("by_triage_level", [])
    if not triage_data:
        return f"Overall ERBI score: {overall:.2f}. Triage-level breakdown unavailable."
    highest = max(triage_data, key=lambda x: x.get("erbi_score", 0))
    return (
        f"The overall Estimated Resource Burden Index (ERBI) is {overall:.2f}. "
        f"CTAS Level {highest['triage_level']} carries the highest resource burden "
        f"(ERBI = {highest['erbi_score']:.2f}), driven by high acuity and extended stays."
    )

def generate_hypothesis_summary(hypothesis_results: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    summaries = []
    for result in hypothesis_results:
        h_id = result.get("hypothesis", "H?")
        reject = result.get("results", {}).get("reject_null", False)
        p_val = result.get("results", {}).get("p_value") or result.get("results", {}).get("p_value", "N/A")
        interpretation = result.get("interpretation", "No interpretation available.")
        summaries.append({
            "hypothesis": h_id,
            "decision": "Reject H₀" if reject else "Fail to Reject H₀",
            "p_value": f"{p_val:.4f}" if isinstance(p_val, float) else str(p_val),
            "insight": interpretation,
        })
    return summaries

def generate_executive_summary(
    kpis: Dict[str, Any],
    erbi: Optional[Dict[str, Any]] = None,
    hypothesis_results: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    summary = {
        "title": "Emergency Department Analytics — Executive Summary",
        "kpi_narrative": generate_kpi_insight(kpis),
    }
    if erbi:
        summary["erbi_narrative"] = generate_erbi_insight(erbi)
    if hypothesis_results:
        summary["hypothesis_summary"] = generate_hypothesis_summary(hypothesis_results)
        rejected = [h for h in hypothesis_results if h.get("results", {}).get("reject_null")]
        summary["strategic_recommendations"] = [h.get("operational_recommendation", "") for h in rejected if h.get("operational_recommendation")]
    return summary
