from typing import Any, Dict, List, Optional, Sequence

from backend.analytics.statistics.assumptions import check_normality, check_sample_size
from backend.analytics.statistics.weighted import weighted_mann_whitney_u, weighted_mean, weighted_median

STATISTICAL_METHOD = "Weighted Mann-Whitney U Test"


def run(
    admitted: List[float],
    discharged: List[float],
    weights_admitted: Optional[Sequence[float]] = None,
    weights_discharged: Optional[Sequence[float]] = None,
) -> Dict[str, Any]:
    """H2: does reported median ED LOS differ between admitted and non-admitted visits?

    ``weights_*`` are ED visit counts; supplying them runs the test over the
    weight-expanded population rather than over the aggregate rows.
    """
    groups = [admitted, discharged]
    group_names = ["Admitted", "Discharged"]
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)

    mw = weighted_mann_whitney_u(
        admitted, discharged, weights_admitted, weights_discharged,
        label_a="Admitted", label_b="Discharged",
    )
    reject = mw["reject_null"]

    w_adm = weights_admitted if weights_admitted is not None else [1.0] * len(admitted)
    w_dis = weights_discharged if weights_discharged is not None else [1.0] * len(discharged)

    def group_summary(vals, wts, label: str) -> Dict[str, Any]:
        if not vals:
            return {"group": label, "n": 0, "weighted_n": 0, "mean_los": 0.0}
        return {
            "group": label,
            "n": len(vals),
            "weighted_n": int(sum(wts)),
            "mean_los": round(weighted_mean(vals, wts), 2),
            "median_los": round(weighted_median(vals, wts), 2),
            "min_los": round(min(vals), 2),
            "max_los": round(max(vals), 2),
        }

    return {
        "hypothesis": "H2",
        "research_question": "Does LOS differ between Admitted and Discharged visits?",
        "null_hypothesis": "Median LOS is equal for admitted and non-admitted.",
        "alternative_hypothesis": "Admitted patients have higher LOS.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {
            "normality": normality,
            "sample_size": size_check,
            "normality_required": False,
        },
        "results": {
            "u_statistic": round(mw["u_statistic"], 4),
            "z_score": round(mw["z_score"], 4),
            "p_value": mw["p_value"],
            "weighted_n": mw["weighted_n"],
            "tie_correction": mw["tie_correction"],
            "rank_biserial": round(mw["rank_biserial"], 6),
            "reject_null": reject,
            "decision": mw["decision"],
        },
        "interpretation": "Admitted patients experience significantly longer stay." if reject else "No significant difference.",
        "clinical_insight": "Admitted patients require more resources." if reject else "No difference.",
        "operational_recommendation": "Implement bed management protocols." if reject else "Explore other drivers.",
        "group_summaries": [
            group_summary(admitted, w_adm, "Admitted"),
            group_summary(discharged, w_dis, "Discharged"),
        ],
    }
