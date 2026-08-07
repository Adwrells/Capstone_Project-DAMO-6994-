from typing import Dict, Any, List
from backend.analytics.statistics.kruskal import kruskal_wallis, dunn_post_hoc
from backend.analytics.statistics.assumptions import check_normality, check_sample_size

def run(groups: List[List[float]], group_names: List[str]) -> Dict[str, Any]:
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)
    h_stat, p_value = kruskal_wallis(*groups)
    reject = p_value < 0.05
    post_hoc = dunn_post_hoc(groups, group_names)
    group_stats = [{"triage_level": name, "n_records": len(g), "mean_los": round(sum(g)/len(g), 2), "min_los": round(min(g), 2), "max_los": round(max(g), 2)} for name, g in zip(group_names, groups) if g]
    return {
        "hypothesis": "H1", "research_question": "Does LOS differ significantly across CTAS Triage Levels?",
        "null_hypothesis": "Median LOS is equal across CTAS levels.", "alternative_hypothesis": "Median LOS differs across CTAS levels.",
        "statistical_method": "Kruskal-Wallis H-Test with Dunn Post-Hoc",
        "assumption_checks": {"normality": normality, "sample_size": size_check},
        "results": {"h_statistic": h_stat, "p_value": p_value, "reject_null": reject, "decision": "Reject H₀" if reject else "Fail to Reject H₀"},
        "interpretation": "Statistically significant differences observed." if reject else "No statistically significant difference.",
        "clinical_insight": "Triage-level urgency is a strong predictor of LOS." if reject else "No independent effect.",
        "operational_recommendation": "Prioritize high-acuity patient flow." if reject else "Investigate other factors.",
        "group_summaries": group_stats, "post_hoc_comparisons": post_hoc,
    }
