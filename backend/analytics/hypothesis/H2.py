from typing import Dict, Any, List
from backend.analytics.statistics.kruskal import mann_whitney_u
from backend.analytics.statistics.assumptions import check_normality, check_sample_size

def run(admitted: List[float], discharged: List[float]) -> Dict[str, Any]:
    groups = [admitted, discharged]
    group_names = ["Admitted", "Discharged"]
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)
    u_stat, p_value = mann_whitney_u(admitted, discharged)
    reject = p_value < 0.05
    def group_summary(vals: List[float], label: str) -> Dict[str, Any]:
        if not vals: return {"group": label, "n": 0, "mean_los": 0.0}
        return {"group": label, "n": len(vals), "mean_los": round(sum(vals)/len(vals), 2), "min_los": round(min(vals), 2), "max_los": round(max(vals), 2)}
    return {
        "hypothesis": "H2", "research_question": "Does LOS differ between Admitted and Discharged visits?",
        "null_hypothesis": "Median LOS is equal for admitted and non-admitted.", "alternative_hypothesis": "Admitted patients have higher LOS.",
        "statistical_method": "Mann-Whitney U Test",
        "assumption_checks": {"normality": normality, "sample_size": size_check},
        "results": {"u_statistic": u_stat, "p_value": p_value, "reject_null": reject, "decision": "Reject H₀" if reject else "Fail to Reject H₀"},
        "interpretation": "Admitted patients experience significantly longer stay." if reject else "No significant difference.",
        "clinical_insight": "Admitted patients require more resources." if reject else "No difference.",
        "operational_recommendation": "Implement bed management protocols." if reject else "Explore other drivers.",
        "group_summaries": [group_summary(admitted, "Admitted"), group_summary(discharged, "Discharged")],
    }
