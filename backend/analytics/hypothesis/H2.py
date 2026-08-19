from typing import Any, Dict, List, Optional, Sequence
import numpy as np
from scipy import stats as sstats
 
STATISTICAL_METHOD = "Weighted Mann-Whitney U Test"
 
def weighted_mean(values: Sequence[float], weights: Sequence[float]) -> float:
    values, weights = np.asarray(values, float), np.asarray(weights, float)
    return float(np.sum(values * weights) / np.sum(weights)) if weights.sum() else 0.0
 
 
def weighted_median(values: Sequence[float], weights: Sequence[float]) -> float:
    values, weights = np.asarray(values, float), np.asarray(weights, float)
    order = np.argsort(values)
    v, w = values[order], weights[order]
    cum = np.cumsum(w)
    cutoff = w.sum() / 2.0
    idx = np.searchsorted(cum, cutoff)
    return float(v[min(idx, len(v) - 1)])
 
 
def check_normality(data: Sequence[float], name: str, max_n: int = 5000) -> Dict[str, Any]:
    data = np.asarray(data, dtype=float)
    data = data[~np.isnan(data)]
    if len(data) < 3:
        return {"group": name, "n": len(data), "test": "Shapiro-Wilk", "is_normal": None, "note": "insufficient n"}
    sample = data if len(data) <= max_n else np.random.default_rng(42).choice(data, max_n, replace=False)
    stat, p = sstats.shapiro(sample)
    return {"group": name, "n": len(data), "test": "Shapiro-Wilk",
            "statistic": round(float(stat), 4), "p_value": round(float(p), 4), "is_normal": bool(p > 0.05)}
 
 
def check_sample_size(groups: List[List[float]], names: List[str], min_n: int = 5) -> List[Dict[str, Any]]:
    return [{"group": n, "n": len(g), "adequate": len(g) >= min_n} for n, g in zip(names, groups)]
 
 
def _weighted_ranks(values: np.ndarray, weights: np.ndarray):
    order = np.argsort(values, kind="mergesort")
    sv, sw = values[order], weights[order]
    n = len(values)
    ranks = np.zeros(n)
    i, cum, tie_term = 0, 0.0, 0.0
    while i < n:
        j = i
        while j < n and sv[j] == sv[i]:
            j += 1
        block_w = sw[i:j].sum()
        ranks[i:j] = cum + (block_w + 1) / 2.0
        cum += block_w
        tie_term += block_w ** 3 - block_w
        i = j
    out = np.zeros(n)
    out[order] = ranks
    return out, tie_term
 
 
def weighted_mann_whitney_u(a_vals: Sequence[float], b_vals: Sequence[float],
                             a_w: Optional[Sequence[float]] = None, b_w: Optional[Sequence[float]] = None,
                             label_a: str = "A", label_b: str = "B") -> Dict[str, Any]:
    a_vals, b_vals = np.asarray(a_vals, float), np.asarray(b_vals, float)
    a_w = np.ones(len(a_vals)) if a_w is None else np.asarray(a_w, float)
    b_w = np.ones(len(b_vals)) if b_w is None else np.asarray(b_w, float)
 
    all_v = np.concatenate([a_vals, b_vals])
    all_w = np.concatenate([a_w, b_w])
    ranks, tie_term = _weighted_ranks(all_v, all_w)
 
    Wa, Wb = float(a_w.sum()), float(b_w.sum())
    N = Wa + Wb
    Ra = float((ranks[:len(a_vals)] * a_w).sum())
 
    Ua = Ra - Wa * (Wa + 1) / 2.0
    Ub = Wa * Wb - Ua
    mean_u = Wa * Wb / 2.0
    var_u = (Wa * Wb / (N * (N - 1))) * (((N ** 3 - N) - tie_term) / 12.0) if N > 1 else 0.0
    var_u = max(var_u, 1e-12)
 
    # continuity correction
    diff = Ua - mean_u
    cc = 0.5 if diff > 0 else (-0.5 if diff < 0 else 0.0)
    z = (diff - cc) / np.sqrt(var_u)
    p = float(2 * (1 - sstats.norm.cdf(abs(z))))
 
    u_min = min(Ua, Ub)
    rank_biserial = 1 - (2 * u_min) / (Wa * Wb) if Wa * Wb else 0.0
    # sign convention: positive means group A tends to rank higher (longer LOS)
    if Ua < Ub:
        rank_biserial = -rank_biserial
 
    reject = p < 0.05
    return {
        "u_statistic": round(float(Ua), 4), "z_score": round(float(z), 4), "p_value": p,
        "weighted_n": int(N), "tie_correction": round(1 - tie_term / (N ** 3 - N), 6) if N > 1 else 1.0,
        "rank_biserial": round(float(rank_biserial), 6),
        "reject_null": reject, "decision": "Reject Null Hypothesis" if reject else "Fail to Reject Null Hypothesis",
        "label_a": label_a, "label_b": label_b,
    }
 
 
# --------------------------------------------------------------------------- #
# H2 entry point
# --------------------------------------------------------------------------- #
def run(
    pandemic_los: List[float],
    pre_pandemic_los: List[float],
    weights_pandemic: Optional[Sequence[float]] = None,
    weights_pre_pandemic: Optional[Sequence[float]] = None,
) -> Dict[str, Any]:
    """H2: did reported median ED LOS differ between the pandemic-affected fiscal
    year (2020-2021) and the preceding (pre-pandemic) fiscal years?
 
    ``weights_*`` are ED visit counts; supplying them runs the test over the
    weight-expanded population rather than over the aggregate rows.
    """
    groups = [pandemic_los, pre_pandemic_los]
    group_names = ["FY 2020-2021 (Pandemic)", "Pre-Pandemic"]
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)
 
    mw = weighted_mann_whitney_u(
        pandemic_los, pre_pandemic_los, weights_pandemic, weights_pre_pandemic,
        label_a="FY 2020-2021 (Pandemic)", label_b="Pre-Pandemic",
    )
    reject = mw["reject_null"]
 
    w_pan = weights_pandemic if weights_pandemic is not None else [1.0] * len(pandemic_los)
    w_pre = weights_pre_pandemic if weights_pre_pandemic is not None else [1.0] * len(pre_pandemic_los)
 
    def group_summary(vals, wts, label: str) -> Dict[str, Any]:
        if not vals:
            return {"group": label, "n": 0, "weighted_n": 0, "mean_los": 0.0}
        return {
            "group": label, "n": len(vals), "weighted_n": int(sum(wts)),
            "mean_los": round(weighted_mean(vals, wts), 2), "median_los": round(weighted_median(vals, wts), 2),
            "min_los": round(min(vals), 2), "max_los": round(max(vals), 2),
        }
 
    pandemic_median = weighted_median(pandemic_los, w_pan) if pandemic_los else 0.0
    pre_median = weighted_median(pre_pandemic_los, w_pre) if pre_pandemic_los else 0.0
 
    return {
        "hypothesis": "H2",
        "research_question": "Did reported median ED length of stay differ between the pandemic-affected "
                              "fiscal year (2020-2021) and the preceding fiscal years?",
        "null_hypothesis": "Median LOS is equal between the pandemic fiscal year and pre-pandemic fiscal years.",
        "alternative_hypothesis": "Median LOS differs between the pandemic fiscal year and pre-pandemic fiscal years.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {
            "normality": normality,
            "sample_size": size_check,
            "normality_required": False,
        },
        "results": {
            "u_statistic": mw["u_statistic"], "z_score": mw["z_score"], "p_value": mw["p_value"],
            "weighted_n": mw["weighted_n"], "tie_correction": mw["tie_correction"],
            "rank_biserial": mw["rank_biserial"], "median_difference_hrs": round(pandemic_median - pre_median, 3),
            "reject_null": reject, "decision": mw["decision"],
        },
        "interpretation": "Reported median LOS differed significantly between the pandemic fiscal year and "
                           "pre-pandemic fiscal years." if reject else
                           "Evidence is insufficient to conclude reported median LOS differed between the "
                           "pandemic fiscal year and pre-pandemic fiscal years.",
        "clinical_insight": "Pandemic-era conditions were associated with a measurable shift in ED LOS." if reject
                             else "No clear pandemic-era shift in ED LOS at the aggregate level.",
        "operational_recommendation": "Incorporate pandemic-period LOS patterns into surge-preparedness planning."
                                       if reject else "No pandemic-specific adjustment to capacity models indicated.",
        "group_summaries": [
            group_summary(pandemic_los, w_pan, "FY 2020-2021 (Pandemic)"),
            group_summary(pre_pandemic_los, w_pre, "Pre-Pandemic"),
        ],
    }
 
if __name__ == "__main__":
    import json
    import pandas as pd
 
    df = pd.read_csv("/mnt/project/ED_Visits_Cleaned.csv")
    df = df[df.ed_visits > 0]  # exclude zero-visit rows from the weighted comparison
 
    pandemic = df[df.fiscal_year == "2020-2021"]
    pre_pandemic = df[df.fiscal_year_start < 2020]
 
    result = run(
        pandemic["median_los_hours"].tolist(),
        pre_pandemic["median_los_hours"].tolist(),
        pandemic["ed_visits"].astype(float).tolist(),
        pre_pandemic["ed_visits"].astype(float).tolist(),
    )
    print(json.dumps(result, indent=2, default=str))