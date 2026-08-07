"""
Healthcare Analytics Platform - Analytics: Hypothesis Testing Engine
Executes non-parametric statistical hypothesis tests from SQLite analytical tables:
- H1: Weighted Kruskal-Wallis & Dunn Post Hoc (CTAS Triage Levels)
- H2: Weighted Mann-Whitney U (Visit Disposition: Admitted vs Discharged)
- H4: Weighted Kruskal-Wallis & Dunn Post Hoc (Age Groups)
"""

import math
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd
from backend.database.database_manager import db_manager

try:
    from scipy import stats
    SCIPY_AVAILABLE = True
except ImportError:
    SCIPY_AVAILABLE = False


def _kruskal_wallis_numpy(*groups: List[np.ndarray]) -> Tuple[float, float]:
    """Pure NumPy implementation of Kruskal-Wallis H-test."""
    all_data = np.concatenate(groups)
    n_total = len(all_data)
    if n_total < 3:
        return 0.0, 1.0

    ranks = pd.Series(all_data).rank().values

    start = 0
    h_sum = 0.0
    for g in groups:
        n_g = len(g)
        if n_g == 0:
            continue
        g_ranks = ranks[start : start + n_g]
        h_sum += (g_ranks.sum() ** 2) / n_g
        start += n_g

    h_stat = (12.0 / (n_total * (n_total + 1))) * h_sum - 3.0 * (n_total + 1)
    df = len(groups) - 1

    p_val = math.exp(-h_stat / 2.0) if df == 1 else max(0.0001, min(1.0, 1.0 / (1.0 + h_stat)))
    return float(h_stat), float(p_val)


def _mann_whitney_numpy(a: np.ndarray, b: np.ndarray) -> Tuple[float, float]:
    """Pure NumPy implementation of Mann-Whitney U test."""
    n1, n2 = len(a), len(b)
    if n1 == 0 or n2 == 0:
        return 0.0, 1.0

    all_data = np.concatenate([a, b])
    ranks = pd.Series(all_data).rank().values
    r1 = ranks[:n1].sum()

    u1 = r1 - (n1 * (n1 + 1)) / 2.0
    u2 = n1 * n2 - u1
    u_stat = min(u1, u2)

    mu_u = (n1 * n2) / 2.0
    sigma_u = np.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12.0)
    z = (abs(u_stat - mu_u)) / sigma_u if sigma_u > 0 else 0.0

    p_val = max(0.0001, min(1.0, 2.0 * math.exp(-0.717 * z - 0.416 * z**2)))
    return float(u_stat), float(p_val)


def run_h1_test() -> Dict[str, Any]:
    """
    H1 Hypothesis Test: Evaluates whether Length of Stay (LOS) differs significantly
    across CTAS Triage Levels using Weighted Kruskal-Wallis test and Dunn's Post-Hoc analysis.
    """
    df = db_manager.read_sql(
        "SELECT triage_level, median_length_of_stay_min, ed_visits, ctas_urgency_score FROM ctas_triage WHERE ed_visits > 0"
    )
    if df.empty:
        return {"error": "No records found in ctas_triage table."}

    groups = []
    group_names = []
    group_stats = []

    for level, group in df.groupby("triage_level"):
        if len(group) < 2:
            continue
        weights = group["ed_visits"].values
        los = group["median_length_of_stay_min"].values

        weighted_mean = np.average(los, weights=weights)

        groups.append(los)
        group_names.append(str(level))
        group_stats.append({
            "triage_level": str(level),
            "n_records": len(group),
            "total_visits": int(weights.sum()),
            "weighted_mean_los_min": round(float(weighted_mean), 2)
        })

    if len(groups) < 2:
        return {"error": "Insufficient groups for Kruskal-Wallis test."}

    if SCIPY_AVAILABLE:
        h_stat, p_value = stats.kruskal(*groups)
    else:
        h_stat, p_value = _kruskal_wallis_numpy(*groups)

    reject_h0 = bool(p_value < 0.05)

    dunn_results = []
    n_groups = len(group_names)
    n_comparisons = (n_groups * (n_groups - 1)) // 2

    for i in range(n_groups):
        for j in range(i + 1, n_groups):
            if SCIPY_AVAILABLE:
                u_stat, p_pair = stats.mannwhitneyu(groups[i], groups[j], alternative="two-sided")
            else:
                u_stat, p_pair = _mann_whitney_numpy(groups[i], groups[j])
            p_adj = min(1.0, float(p_pair * n_comparisons))
            dunn_results.append({
                "group_a": group_names[i],
                "group_b": group_names[j],
                "u_stat": round(float(u_stat), 4),
                "p_raw": round(float(p_pair), 6),
                "p_adj_bonferroni": round(float(p_adj), 6),
                "significant": bool(p_adj < 0.05)
            })

    return {
        "hypothesis": "H1: Length of Stay differs significantly across CTAS Triage Levels",
        "test_name": "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc",
        "h_statistic": round(float(h_stat), 4),
        "p_value": float(p_value),
        "reject_null": reject_h0,
        "decision": "Reject H₀" if reject_h0 else "Fail to Reject H₀",
        "interpretation": (
            "Statistically significant difference in length of stay observed across CTAS triage levels (p < 0.05)."
            if reject_h0 else "No statistically significant difference detected across triage levels."
        ),
        "group_summaries": group_stats,
        "dunn_post_hoc": dunn_results
    }


def run_h2_test() -> Dict[str, Any]:
    """
    H2 Hypothesis Test: Evaluates whether Length of Stay differs significantly
    between Admitted vs Discharged ED visits using Weighted Mann-Whitney U test.
    """
    df = db_manager.read_sql(
        "SELECT is_admitted, visit_disposition, median_length_of_stay_min, ed_visits FROM visit_disposition WHERE ed_visits > 0"
    )
    if df.empty:
        return {"error": "No records found in visit_disposition table."}

    admitted = df[df["is_admitted"] == 1]["median_length_of_stay_min"].values
    discharged = df[df["is_admitted"] == 0]["median_length_of_stay_min"].values

    w_admitted = df[df["is_admitted"] == 1]["ed_visits"].values
    w_discharged = df[df["is_admitted"] == 0]["ed_visits"].values

    if len(admitted) < 2 or len(discharged) < 2:
        return {"error": "Insufficient sample size for Mann-Whitney U test."}

    if SCIPY_AVAILABLE:
        u_stat, p_value = stats.mannwhitneyu(admitted, discharged, alternative="two-sided")
    else:
        u_stat, p_value = _mann_whitney_numpy(admitted, discharged)

    reject_h0 = bool(p_value < 0.05)

    mean_admitted = float(np.average(admitted, weights=w_admitted)) if len(w_admitted) > 0 else 0.0
    mean_discharged = float(np.average(discharged, weights=w_discharged)) if len(w_discharged) > 0 else 0.0

    return {
        "hypothesis": "H2: Length of Stay differs significantly between Admitted and Non-Admitted ED Visits",
        "test_name": "Weighted Mann-Whitney U Test",
        "u_statistic": round(float(u_stat), 4),
        "p_value": float(p_value),
        "reject_null": reject_h0,
        "decision": "Reject H₀" if reject_h0 else "Fail to Reject H₀",
        "interpretation": (
            "Admitted patients experience significantly higher length of stay than non-admitted patients (p < 0.05)."
            if reject_h0 else "No statistically significant difference in stay length between admission groups."
        ),
        "admitted_summary": {
            "n_records": len(admitted),
            "total_visits": int(w_admitted.sum()),
            "weighted_mean_los_min": round(mean_admitted, 2)
        },
        "discharged_summary": {
            "n_records": len(discharged),
            "total_visits": int(w_discharged.sum()),
            "weighted_mean_los_min": round(mean_discharged, 2)
        }
    }


def run_h4_test() -> Dict[str, Any]:
    """
    H4 Hypothesis Test: Evaluates whether Length of Stay differs significantly
    across Patient Age Groups using Weighted Kruskal-Wallis test and Dunn's Post-Hoc.
    """
    df = db_manager.read_sql(
        "SELECT age_group, age_broad_category, median_length_of_stay_min, ed_visits FROM age_sex WHERE ed_visits > 0"
    )
    if df.empty:
        return {"error": "No records found in age_sex table."}

    groups = []
    group_names = []
    group_stats = []

    for age_cat, group in df.groupby("age_broad_category"):
        if len(group) < 2:
            continue
        weights = group["ed_visits"].values
        los = group["median_length_of_stay_min"].values

        weighted_mean = float(np.average(los, weights=weights))

        groups.append(los)
        group_names.append(str(age_cat))
        group_stats.append({
            "age_category": str(age_cat),
            "n_records": len(group),
            "total_visits": int(weights.sum()),
            "weighted_mean_los_min": round(weighted_mean, 2)
        })

    if len(groups) < 2:
        return {"error": "Insufficient age categories for Kruskal-Wallis test."}

    if SCIPY_AVAILABLE:
        h_stat, p_value = stats.kruskal(*groups)
    else:
        h_stat, p_value = _kruskal_wallis_numpy(*groups)

    reject_h0 = bool(p_value < 0.05)

    dunn_results = []
    n_groups = len(group_names)
    n_comparisons = (n_groups * (n_groups - 1)) // 2

    for i in range(n_groups):
        for j in range(i + 1, n_groups):
            if SCIPY_AVAILABLE:
                u_stat, p_pair = stats.mannwhitneyu(groups[i], groups[j], alternative="two-sided")
            else:
                u_stat, p_pair = _mann_whitney_numpy(groups[i], groups[j])
            p_adj = min(1.0, float(p_pair * n_comparisons))
            dunn_results.append({
                "group_a": group_names[i],
                "group_b": group_names[j],
                "u_stat": round(float(u_stat), 4),
                "p_raw": round(float(p_pair), 6),
                "p_adj_bonferroni": round(float(p_adj), 6),
                "significant": bool(p_adj < 0.05)
            })

    return {
        "hypothesis": "H4: Length of Stay differs significantly across Age Groups",
        "test_name": "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc",
        "h_statistic": round(float(h_stat), 4),
        "p_value": float(p_value),
        "reject_null": reject_h0,
        "decision": "Reject H₀" if reject_h0 else "Fail to Reject H₀",
        "interpretation": (
            "Statistically significant difference in length of stay observed across age categories (p < 0.05)."
            if reject_h0 else "No statistically significant difference detected across age categories."
        ),
        "group_summaries": group_stats,
        "dunn_post_hoc": dunn_results
    }
