"""
Healthcare Analytics Platform - Statistics: Rank-Based Tests

Thin adapters over backend.analytics.statistics.weighted, kept at their original
signatures so existing call sites are unaffected. Everything statistical lives in the
weighted engine; these functions only reshape its output.

Passing ``weights`` treats the values as aggregate rows carrying visit counts. Omitting
them gives every observation unit weight, which reduces to the textbook tests.

Previously these carried their own ranking code and approximated the p-value with
``2 * exp(-0.717z - 0.416z^2)``. That approximation is accurate to roughly two decimal
places in the tail and drifts furthest exactly where significance is decided, so it has
been replaced by the exact chi-square / normal survival functions.
"""

from typing import Any, Dict, List, Optional, Sequence, Tuple

from .weighted import (
    weighted_dunn_post_hoc,
    weighted_kruskal_wallis,
    weighted_mann_whitney_u,
)

__all__ = ["kruskal_wallis", "dunn_post_hoc", "mann_whitney_u", "kruskal_wallis_full"]


def kruskal_wallis(
    *groups: Sequence[float],
    weights: Optional[Sequence[Sequence[float]]] = None,
) -> Tuple[float, float]:
    """Kruskal-Wallis H test. Returns ``(H, p)`` rounded for display."""
    group_list = [list(g) for g in groups]
    total = sum(len(g) for g in group_list)
    # Preserved guard: fewer than 3 observations cannot support the chi-square approximation.
    if total < 3 or len(group_list) < 2:
        return 0.0, 1.0

    res = weighted_kruskal_wallis(
        group_list, [f"g{i}" for i in range(len(group_list))], weights
    )
    return round(float(res["h_statistic"]), 4), round(float(res["p_value"]), 6)


def kruskal_wallis_full(
    groups: Sequence[Sequence[float]],
    group_names: Sequence[str],
    weights: Optional[Sequence[Sequence[float]]] = None,
) -> Dict[str, Any]:
    """Full Kruskal-Wallis result including df, effect size, and tie correction."""
    return weighted_kruskal_wallis(groups, group_names, weights)


def dunn_post_hoc(
    groups: List[List[float]],
    group_names: List[str],
    weights: Optional[Sequence[Sequence[float]]] = None,
) -> List[Dict[str, Any]]:
    """Dunn's post-hoc test with Bonferroni-adjusted p-values.

    This is now the genuine Dunn procedure: pairwise mean-rank z-tests sharing the
    pooled rank variance from the omnibus test. The earlier version ran independent
    Mann-Whitney U tests, which re-rank inside each pair and therefore do not decompose
    the H statistic they follow up.
    """
    return weighted_dunn_post_hoc(groups, group_names, weights)


def mann_whitney_u(
    a: Sequence[float],
    b: Sequence[float],
    weights_a: Optional[Sequence[float]] = None,
    weights_b: Optional[Sequence[float]] = None,
) -> Tuple[float, float]:
    """Mann-Whitney U test. Returns ``(U, p)`` rounded for display."""
    if not len(a) or not len(b):
        return 0.0, 1.0
    res = weighted_mann_whitney_u(list(a), list(b), weights_a, weights_b)
    return round(float(res["u_statistic"]), 4), round(float(res["p_value"]), 6)
