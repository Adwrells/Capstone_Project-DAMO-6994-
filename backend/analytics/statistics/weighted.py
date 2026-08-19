"""
Healthcare Analytics Platform - Statistics: Frequency-Weighted Non-Parametric Engine

Canonical implementation of the non-parametric tests used by H1/H2/H4. Every other
module in the pipeline delegates here so a single definition of "the test" exists.

Why weighted
------------
CIHI/NACRS rows are AGGREGATES: one row carries a reported median LOS plus the number
of ED visits it summarises. Running an unweighted test over those rows answers "do the
912 aggregate rows differ?" (N = 912) rather than the research question "do the
174 million visits differ?" (N = sum of ed_visits). ``ed_visits`` is therefore a
frequency weight, not a covariate, and every rank must be computed over the expanded
population.

Method (ported from backend/hypothesis testing/H1_testing.ipynb)
---------------------------------------------------------------
1. Collapse to unique values and sum their weights.
2. Midrank each unique value across the expanded population:
   rank(v) = (cumulative weight before v) + (weight(v) + 1) / 2
3. Kruskal-Wallis H over weighted rank sums, then divide by the tie correction
   1 - sum(t^3 - t) / (N^3 - N), which is non-negligible because LOS is reported in
   whole minutes and ties run to millions.
4. Exact p-value from the chi-square survival function - not a logistic approximation.

The special functions are pure-Python (``math`` only) so the engine produces identical
numbers whether or not SciPy is installed.
"""

import math
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

__all__ = [
    "chi2_sf",
    "normal_sf",
    "student_t_sf",
    "weighted_mean",
    "weighted_median",
    "weighted_midranks",
    "weighted_kruskal_wallis",
    "weighted_mann_whitney_u",
    "weighted_dunn_post_hoc",
]

# Weights are visit counts. Allow for float round-trips through SQLite/pandas.
_INTEGER_TOLERANCE = 1e-6


# ─────────────────────────────────────────────────────────────────────────────
# Special functions (pure Python, no SciPy dependency)
# ─────────────────────────────────────────────────────────────────────────────

def _gamma_p_series(a: float, x: float) -> float:
    """Regularized lower incomplete gamma P(a, x) by series expansion (x < a + 1)."""
    if x <= 0.0:
        return 0.0
    term = 1.0 / a
    total = term
    for n in range(1, 1000):
        term *= x / (a + n)
        total += term
        if abs(term) < abs(total) * 1e-16:
            break
    try:
        return total * math.exp(-x + a * math.log(x) - math.lgamma(a))
    except (OverflowError, ValueError):
        return 0.0


def _gamma_q_continued_fraction(a: float, x: float) -> float:
    """Regularized upper incomplete gamma Q(a, x) by Lentz continued fraction (x >= a + 1)."""
    tiny = 1e-300
    b = x + 1.0 - a
    c = 1.0 / tiny
    d = 1.0 / b if b != 0.0 else 1.0 / tiny
    h = d
    for i in range(1, 1000):
        an = -i * (i - a)
        b += 2.0
        d = an * d + b
        if abs(d) < tiny:
            d = tiny
        c = b + an / c
        if abs(c) < tiny:
            c = tiny
        d = 1.0 / d
        delta = d * c
        h *= delta
        if abs(delta - 1.0) < 1e-16:
            break
    try:
        return h * math.exp(-x + a * math.log(x) - math.lgamma(a))
    except (OverflowError, ValueError):
        # exp underflows to zero for the very large H values aggregate data produces.
        return 0.0


def chi2_sf(x: float, df: int) -> float:
    """Chi-square survival function P(X > x). Equivalent to scipy.stats.chi2.sf."""
    if df <= 0:
        return 1.0
    if x <= 0.0:
        return 1.0
    if not math.isfinite(x):
        return 0.0
    a = df / 2.0
    half_x = x / 2.0
    if half_x < a + 1.0:
        return max(0.0, min(1.0, 1.0 - _gamma_p_series(a, half_x)))
    return max(0.0, min(1.0, _gamma_q_continued_fraction(a, half_x)))


def normal_sf(z: float) -> float:
    """Standard normal survival function P(Z > z), exact via the error function."""
    return 0.5 * math.erfc(z / math.sqrt(2.0))


def _betacf(a: float, b: float, x: float) -> float:
    """Continued fraction for the incomplete beta function (Lentz's method)."""
    tiny = 1e-300
    qab, qap, qam = a + b, a + 1.0, a - 1.0
    c = 1.0
    d = 1.0 - qab * x / qap
    if abs(d) < tiny:
        d = tiny
    d = 1.0 / d
    h = d
    for m in range(1, 300):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1.0 + aa * d
        if abs(d) < tiny:
            d = tiny
        c = 1.0 + aa / c
        if abs(c) < tiny:
            c = tiny
        d = 1.0 / d
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1.0 + aa * d
        if abs(d) < tiny:
            d = tiny
        c = 1.0 + aa / c
        if abs(c) < tiny:
            c = tiny
        d = 1.0 / d
        delta = d * c
        h *= delta
        if abs(delta - 1.0) < 1e-15:
            break
    return h


def _betai(a: float, b: float, x: float) -> float:
    """Regularized incomplete beta function I_x(a, b)."""
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    try:
        front = math.exp(
            math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b)
            + a * math.log(x) + b * math.log(1.0 - x)
        )
    except (OverflowError, ValueError):
        return 0.0
    if x < (a + 1.0) / (a + b + 2.0):
        return front * _betacf(a, b, x) / a
    return 1.0 - front * _betacf(b, a, 1.0 - x) / b


def student_t_sf(t: float, df: float) -> float:
    """Student-t survival function P(T > t). Equivalent to scipy.stats.t.sf.

    Replaces the ``2 * exp(-0.717|t| - 0.416 t^2)`` approximation that the regression
    modules previously used, which is a normal-tail fit and ignores df entirely.
    """
    if df <= 0:
        return 1.0
    if not math.isfinite(t):
        return 0.0 if t > 0 else 1.0
    x = df / (df + t * t)
    half = 0.5 * _betai(df / 2.0, 0.5, x)
    return max(0.0, min(1.0, half if t > 0 else 1.0 - half))


# ─────────────────────────────────────────────────────────────────────────────
# Weighted descriptive helpers
# ─────────────────────────────────────────────────────────────────────────────

def _clean_pairs(
    values: Iterable[float],
    weights: Optional[Iterable[float]],
) -> Tuple[List[float], List[int]]:
    """Drops non-finite rows and non-positive weights, then coerces weights to counts."""
    vals = list(values)
    if weights is None:
        wts: List[float] = [1.0] * len(vals)
    else:
        wts = list(weights)
    if len(wts) != len(vals):
        raise ValueError("values and weights must be the same length")

    out_v: List[float] = []
    out_w: List[int] = []
    for v, w in zip(vals, wts):
        try:
            fv, fw = float(v), float(w)
        except (TypeError, ValueError):
            continue
        if not math.isfinite(fv) or not math.isfinite(fw) or fw <= 0:
            continue
        if abs(fw - round(fw)) > _INTEGER_TOLERANCE:
            raise ValueError(f"Weights must be integer visit counts; got {fw!r}.")
        out_v.append(fv)
        out_w.append(int(round(fw)))
    return out_v, out_w


def weighted_mean(values: Iterable[float], weights: Optional[Iterable[float]] = None) -> float:
    vals, wts = _clean_pairs(values, weights)
    total = sum(wts)
    if total == 0:
        return 0.0
    return sum(v * w for v, w in zip(vals, wts)) / total


def weighted_median(values: Iterable[float], weights: Optional[Iterable[float]] = None) -> float:
    vals, wts = _clean_pairs(values, weights)
    if not vals:
        return 0.0
    order = sorted(range(len(vals)), key=lambda i: vals[i])
    midpoint = sum(wts) / 2.0
    cumulative = 0.0
    for i in order:
        cumulative += wts[i]
        if cumulative >= midpoint:
            return vals[i]
    return vals[order[-1]]


def weighted_midranks(values: Sequence[float], weights: Sequence[int]) -> Tuple[Dict[float, float], List[int], int]:
    """Midranks each unique value across the weight-expanded population.

    Returns ``(rank_by_value, tie_sizes, total_weight)``. ``tie_sizes`` is the summed
    weight of each distinct value, which is what the tie correction consumes.
    """
    weight_by_value: Dict[float, int] = {}
    for v, w in zip(values, weights):
        weight_by_value[v] = weight_by_value.get(v, 0) + w

    rank_by_value: Dict[float, float] = {}
    tie_sizes: List[int] = []
    cumulative_before = 0
    for value in sorted(weight_by_value):
        tie = weight_by_value[value]
        rank_by_value[value] = cumulative_before + (tie + 1) / 2.0
        tie_sizes.append(tie)
        cumulative_before += tie
    return rank_by_value, tie_sizes, cumulative_before


def _tie_correction(tie_sizes: Sequence[int], n_total: int) -> float:
    """1 - sum(t^3 - t) / (N^3 - N). Returns 1.0 when the correction is undefined."""
    if n_total < 2:
        return 1.0
    denominator = n_total ** 3 - n_total
    if denominator == 0:
        return 1.0
    tie_sum = sum(t ** 3 - t for t in tie_sizes)
    correction = 1.0 - (tie_sum / denominator)
    # Every observation identical => correction collapses to 0 and H is undefined.
    return correction if correction > 0 else 1.0


# ─────────────────────────────────────────────────────────────────────────────
# Kruskal-Wallis
# ─────────────────────────────────────────────────────────────────────────────

def weighted_kruskal_wallis(
    groups: Sequence[Sequence[float]],
    group_names: Sequence[str],
    weights: Optional[Sequence[Sequence[float]]] = None,
) -> Dict[str, Any]:
    """Frequency-weighted Kruskal-Wallis H test with tie correction and exact p-value.

    ``weights`` parallels ``groups``; pass ``None`` for an unweighted test (every
    observation counts once), which reproduces the classic Kruskal-Wallis.
    """
    if weights is None:
        weights = [[1.0] * len(g) for g in groups]
    if len(weights) != len(groups):
        raise ValueError("groups and weights must describe the same number of groups")

    clean: List[Tuple[str, List[float], List[int]]] = []
    for name, g, w in zip(group_names, groups, weights):
        vals, wts = _clean_pairs(g, w)
        if vals:
            clean.append((str(name), vals, wts))

    k = len(clean)
    n_total = sum(sum(wts) for _, _, wts in clean)
    empty = {
        "h_statistic": 0.0,
        "degrees_of_freedom": max(0, k - 1),
        "p_value": 1.0,
        "weighted_n": int(n_total),
        "tie_correction": 1.0,
        "epsilon_squared": 0.0,
        "reject_null": False,
        "decision": "Fail to Reject H₀",
        "group_statistics": [],
    }
    if k < 2 or n_total < 3:
        return empty

    all_values = [v for _, vals, _ in clean for v in vals]
    all_weights = [w for _, _, wts in clean for w in wts]
    rank_by_value, tie_sizes, _ = weighted_midranks(all_values, all_weights)

    group_statistics: List[Dict[str, Any]] = []
    rank_sum_term = 0.0
    for name, vals, wts in clean:
        group_weight = sum(wts)
        rank_sum = sum(rank_by_value[v] * w for v, w in zip(vals, wts))
        rank_sum_term += (rank_sum ** 2) / group_weight
        group_statistics.append({
            "group": name,
            "n_records": len(vals),
            "weighted_n": int(group_weight),
            "rank_sum": rank_sum,
            "mean_rank": rank_sum / group_weight,
            "weighted_mean": round(weighted_mean(vals, wts), 4),
            "weighted_median": round(weighted_median(vals, wts), 4),
            "min": round(min(vals), 4),
            "max": round(max(vals), 4),
        })

    h_raw = (12.0 / (n_total * (n_total + 1))) * rank_sum_term - 3.0 * (n_total + 1)
    correction = _tie_correction(tie_sizes, n_total)
    h_corrected = h_raw / correction
    df = k - 1
    p_value = chi2_sf(h_corrected, df)

    # Epsilon-squared: proportion of rank variance explained. Bounded to [0, 1] because
    # sampling noise can drive the raw expression slightly negative under a true null.
    epsilon_squared = 0.0
    if n_total - k > 0:
        epsilon_squared = max(0.0, min(1.0, (h_corrected - k + 1) / (n_total - k)))

    reject = bool(p_value < 0.05)
    return {
        "h_statistic": h_corrected,
        "degrees_of_freedom": df,
        "p_value": p_value,
        "weighted_n": int(n_total),
        "tie_correction": correction,
        "epsilon_squared": epsilon_squared,
        "reject_null": reject,
        "decision": "Reject H₀" if reject else "Fail to Reject H₀",
        "group_statistics": group_statistics,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Mann-Whitney U
# ─────────────────────────────────────────────────────────────────────────────

def weighted_mann_whitney_u(
    a: Sequence[float],
    b: Sequence[float],
    weights_a: Optional[Sequence[float]] = None,
    weights_b: Optional[Sequence[float]] = None,
    label_a: str = "Group A",
    label_b: str = "Group B",
) -> Dict[str, Any]:
    """Frequency-weighted Mann-Whitney U with tie-corrected normal approximation.

    The normal approximation is exact for practical purposes here: weighted n runs to
    millions, far past the point where the exact permutation distribution matters.
    """
    vals_a, wts_a = _clean_pairs(a, weights_a)
    vals_b, wts_b = _clean_pairs(b, weights_b)

    n1, n2 = sum(wts_a), sum(wts_b)
    if not vals_a or not vals_b or n1 == 0 or n2 == 0:
        return {
            "u_statistic": 0.0,
            "p_value": 1.0,
            "z_score": 0.0,
            "rank_biserial": 0.0,
            "weighted_n": int(n1 + n2),
            "tie_correction": 1.0,
            "reject_null": False,
            "decision": "Fail to Reject H₀",
            "group_statistics": [],
        }

    rank_by_value, tie_sizes, n_total = weighted_midranks(vals_a + vals_b, wts_a + wts_b)
    r1 = sum(rank_by_value[v] * w for v, w in zip(vals_a, wts_a))

    u1 = r1 - (n1 * (n1 + 1)) / 2.0
    u2 = n1 * n2 - u1
    u_stat = min(u1, u2)

    mu_u = (n1 * n2) / 2.0
    tie_sum = sum(t ** 3 - t for t in tie_sizes)
    variance = (n1 * n2 / 12.0) * ((n_total + 1) - tie_sum / (n_total * (n_total - 1)))
    sigma_u = math.sqrt(variance) if variance > 0 else 0.0

    if sigma_u > 0:
        # Continuity correction, negligible at this scale but correct at small n.
        z = (abs(u_stat - mu_u) - 0.5) / sigma_u
        z = max(0.0, z)
        p_value = min(1.0, 2.0 * normal_sf(z))
    else:
        z, p_value = 0.0, 1.0

    # Rank-biserial correlation: the common-language effect size for this test.
    rank_biserial = 1.0 - (2.0 * u_stat) / (n1 * n2)

    reject = bool(p_value < 0.05)
    return {
        "u_statistic": u_stat,
        "p_value": p_value,
        "z_score": z,
        "rank_biserial": rank_biserial,
        "weighted_n": int(n_total),
        "tie_correction": _tie_correction(tie_sizes, n_total),
        "reject_null": reject,
        "decision": "Reject H₀" if reject else "Fail to Reject H₀",
        "group_statistics": [
            {
                "group": label_a,
                "n_records": len(vals_a),
                "weighted_n": int(n1),
                "weighted_mean": round(weighted_mean(vals_a, wts_a), 4),
                "weighted_median": round(weighted_median(vals_a, wts_a), 4),
                "min": round(min(vals_a), 4),
                "max": round(max(vals_a), 4),
            },
            {
                "group": label_b,
                "n_records": len(vals_b),
                "weighted_n": int(n2),
                "weighted_mean": round(weighted_mean(vals_b, wts_b), 4),
                "weighted_median": round(weighted_median(vals_b, wts_b), 4),
                "min": round(min(vals_b), 4),
                "max": round(max(vals_b), 4),
            },
        ],
    }


# ─────────────────────────────────────────────────────────────────────────────
# Dunn post-hoc
# ─────────────────────────────────────────────────────────────────────────────

def weighted_dunn_post_hoc(
    groups: Sequence[Sequence[float]],
    group_names: Sequence[str],
    weights: Optional[Sequence[Sequence[float]]] = None,
    alpha: float = 0.05,
) -> List[Dict[str, Any]]:
    """Dunn's test: pairwise mean-rank z-tests sharing the pooled rank variance.

    This is the genuine post-hoc for Kruskal-Wallis. The previous implementation ran
    independent Mann-Whitney U tests, which re-rank within each pair and so do not
    decompose the omnibus H they are meant to follow up.
    """
    if weights is None:
        weights = [[1.0] * len(g) for g in groups]

    clean: List[Tuple[str, List[float], List[int]]] = []
    for name, g, w in zip(group_names, groups, weights):
        vals, wts = _clean_pairs(g, w)
        if vals:
            clean.append((str(name), vals, wts))

    k = len(clean)
    if k < 2:
        return []

    all_values = [v for _, vals, _ in clean for v in vals]
    all_weights = [w for _, _, wts in clean for w in wts]
    rank_by_value, tie_sizes, n_total = weighted_midranks(all_values, all_weights)
    if n_total < 2:
        return []

    mean_ranks: List[float] = []
    group_weights: List[int] = []
    for _, vals, wts in clean:
        gw = sum(wts)
        mean_ranks.append(sum(rank_by_value[v] * w for v, w in zip(vals, wts)) / gw)
        group_weights.append(gw)

    tie_sum = sum(t ** 3 - t for t in tie_sizes)
    pooled = (n_total * (n_total + 1) / 12.0) - tie_sum / (12.0 * (n_total - 1))

    n_comparisons = (k * (k - 1)) // 2
    results: List[Dict[str, Any]] = []
    for i in range(k):
        for j in range(i + 1, k):
            se = math.sqrt(pooled * (1.0 / group_weights[i] + 1.0 / group_weights[j])) if pooled > 0 else 0.0
            z = abs(mean_ranks[i] - mean_ranks[j]) / se if se > 0 else 0.0
            p_raw = min(1.0, 2.0 * normal_sf(z))
            p_adj = min(1.0, p_raw * n_comparisons)
            results.append({
                "group_a": clean[i][0],
                "group_b": clean[j][0],
                "mean_rank_a": mean_ranks[i],
                "mean_rank_b": mean_ranks[j],
                "z_score": round(z, 4),
                "p_raw": p_raw,
                "p_adj_bonferroni": p_adj,
                "significant": bool(p_adj < alpha),
            })
    return results
