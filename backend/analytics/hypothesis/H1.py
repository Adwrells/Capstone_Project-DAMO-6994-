from typing import Any, Dict, List, Optional, Sequence
 
from backend.analytics.hypothesis_testing import is_rollup_or_excluded
from backend.analytics.statistics.assumptions import check_normality, check_sample_size
from backend.analytics.statistics.kruskal import dunn_post_hoc, kruskal_wallis_full
from backend.analytics.statistics.weighted import weighted_mean, weighted_median
 
STATISTICAL_METHOD = "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc"
 
 
def run(
    groups: List[List[float]],
    group_names: List[str],
    weights: Optional[Sequence[Sequence[float]]] = None,
) -> Dict[str, Any]:
    """H1: does reported median ED LOS differ across CTAS triage levels?
 
    ``weights`` are ED visit counts. Supplying them runs the test over the
    weight-expanded population, which is what the aggregate NACRS data requires;
    omitting them falls back to an unweighted test over the aggregate rows.
    """
    valid_idx = [i for i, name in enumerate(group_names) if not is_rollup_or_excluded(name)]
    groups = [groups[i] for i in valid_idx]
    group_names = [group_names[i] for i in valid_idx]
    if weights is not None:
        weights = [weights[i] for i in valid_idx]
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)
 
    kw = kruskal_wallis_full(groups, group_names, weights)
    post_hoc = dunn_post_hoc(groups, group_names, weights)
    reject = kw["reject_null"]
 
    wts = weights if weights is not None else [[1.0] * len(g) for g in groups]
    group_stats = [
        {
            "triage_level": name,
            "n_records": len(g),
            "weighted_n": int(sum(w)),
            "mean_los": round(weighted_mean(g, w), 2),
            "median_los": round(weighted_median(g, w), 2),
            "min_los": round(min(g), 2),
            "max_los": round(max(g), 2),
        }
        for name, g, w in zip(group_names, groups, wts) if g
    ]
 
    return {
        "hypothesis": "H1",
        "research_question": "Does LOS differ significantly across CTAS Triage Levels?",
        "null_hypothesis": "Median LOS is equal across CTAS levels.",
        "alternative_hypothesis": "Median LOS differs across CTAS levels.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {
            "normality": normality,
            "sample_size": size_check,
            # Kruskal-Wallis is distribution-free: normality is reported for context,
            # not as a gate on validity.
            "normality_required": False,
        },
        "results": {
            "h_statistic": round(kw["h_statistic"], 4),
            "degrees_of_freedom": kw["degrees_of_freedom"],
            "p_value": kw["p_value"],
            "weighted_n": kw["weighted_n"],
            "tie_correction": kw["tie_correction"],
            "epsilon_squared": round(kw["epsilon_squared"], 6),
            "reject_null": reject,
            "decision": kw["decision"],
        },
        "interpretation": "Statistically significant differences observed." if reject else "No statistically significant difference.",
        "clinical_insight": "Triage-level urgency is a strong predictor of LOS." if reject else "No independent effect.",
        "operational_recommendation": "Prioritize high-acuity patient flow." if reject else "Investigate other factors.",
        "group_summaries": group_stats,
        "post_hoc_comparisons": post_hoc,
    }
 