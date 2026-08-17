from typing import Any, Dict, List, Optional, Sequence

from backend.analytics.statistics.assumptions import check_normality, check_sample_size
from backend.analytics.statistics.kruskal import dunn_post_hoc, kruskal_wallis_full
from backend.analytics.statistics.weighted import weighted_mean, weighted_median

STATISTICAL_METHOD = "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc"

AGE_CATEGORY_ORDER = [
    "Pediatric Population",
    "Young Adult Population",
    "Adult Population",
    "Pre-Senior Population",
    "Geriatric Population",
]


def run(
    groups: List[List[float]],
    group_names: List[str],
    weights: Optional[Sequence[Sequence[float]]] = None,
) -> Dict[str, Any]:
    """H4: does reported median ED LOS differ across patient age groups?

    ``weights`` are ED visit counts. Supplying them runs the test over the
    weight-expanded population, which is what the aggregate NACRS data requires.
    """
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)

    kw = kruskal_wallis_full(groups, group_names, weights)
    post_hoc = dunn_post_hoc(groups, group_names, weights)
    reject = kw["reject_null"]

    wts = weights if weights is not None else [[1.0] * len(g) for g in groups]
    group_stats = [
        {
            "age_category": name,
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
        "hypothesis": "H4",
        "research_question": "Does LOS differ significantly across Patient Age Groups?",
        "null_hypothesis": "Median LOS is equal across age categories.",
        "alternative_hypothesis": "Median LOS differs across age categories.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {
            "normality": normality,
            "sample_size": size_check,
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
        "interpretation": "Statistically significant differences across age groups." if reject else "No difference.",
        "clinical_insight": "Older adults experience longer stay." if reject else "No age effect.",
        "operational_recommendation": "Develop age-stratified throughput models." if reject else "Explore other drivers.",
        "group_summaries": group_stats,
        "post_hoc_comparisons": post_hoc,
    }
