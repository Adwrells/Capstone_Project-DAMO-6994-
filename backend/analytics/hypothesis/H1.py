from typing import Any, Dict, List, Sequence
import numpy as np
from scipy import stats as sstats
 
STATISTICAL_METHOD = "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc"
 
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
 
 
def weighted_kruskal_wallis(groups_values: List[List[float]], groups_weights: List[List[float]],
                             group_names: List[str]) -> Dict[str, Any]:
    all_v = np.concatenate([np.asarray(g, float) for g in groups_values])
    all_w = np.concatenate([np.asarray(w, float) for w in groups_weights])
    ranks, tie_term = _weighted_ranks(all_v, all_w)
 
    N = all_w.sum()
    idx, R, W = 0, [], []
    for gv in groups_values:
        k = len(gv)
        r, w = ranks[idx:idx + k], all_w[idx:idx + k]
        R.append(float((r * w).sum()))
        W.append(float(w.sum()))
        idx += k
 
    H = (12.0 / (N * (N + 1))) * sum((Ri ** 2) / Wi for Ri, Wi in zip(R, W)) - 3 * (N + 1)
    C = 1 - tie_term / (N ** 3 - N) if N > 1 else 1.0
    Hc = H / C if C > 0 else H
    df = len(groups_values) - 1
    p = float(1 - sstats.chi2.cdf(Hc, df))
    eps2 = Hc / (N - 1) if N > 1 else 0.0
    reject = p < 0.05
    return {
        "h_statistic": round(float(Hc), 4), "degrees_of_freedom": df, "p_value": p, "weighted_n": int(N),
        "tie_correction": round(float(C), 6), "epsilon_squared": round(float(eps2), 6),
        "reject_null": reject, "decision": "Reject Null Hypothesis" if reject else "Fail to Reject Null Hypothesis",
        "_mean_ranks": {name: (R[i] / W[i] if W[i] else 0.0) for i, name in enumerate(group_names)},
        "_N": N, "_tie_term": tie_term,
    }
 
 
def dunn_post_hoc(groups_values: List[List[float]], groups_weights: List[List[float]],
                   group_names: List[str], kw_result: Dict[str, Any]) -> List[Dict[str, Any]]:
    N, tie_term = kw_result["_N"], kw_result["_tie_term"]
    mean_ranks, W = kw_result["_mean_ranks"], {}
    for name, w in zip(group_names, groups_weights):
        W[name] = float(np.sum(w))
 
    pairs = [(i, j) for i in range(len(group_names)) for j in range(i + 1, len(group_names))]
    n_comp = len(pairs)
    tie_adj = tie_term / (12.0 * (N - 1)) if N > 1 else 0.0
    out = []
    for i, j in pairs:
        gi, gj = group_names[i], group_names[j]
        se = np.sqrt(max((N * (N + 1) / 12.0 - tie_adj), 0.0) * (1.0 / W[gi] + 1.0 / W[gj]))
        z = (mean_ranks[gi] - mean_ranks[gj]) / se if se > 0 else 0.0
        p_raw = 2 * (1 - sstats.norm.cdf(abs(z)))
        p_adj = min(1.0, p_raw * n_comp)
        out.append({"group_a": gi, "group_b": gj, "z_statistic": round(float(z), 4),
                     "p_value_raw": p_raw, "p_value_adjusted": p_adj, "significant": bool(p_adj < 0.05)})
    return out
 

def run(groups: List[List[float]], group_names: List[str],
        weights: List[List[float]]) -> Dict[str, Any]:
    """H1: does reported median ED LOS differ across CTAS triage levels?
 
    ``weights`` are ED visit counts (the number of individual visits each
    aggregate row represents), so the test runs over the visit-weighted population.
    """
    if any(len(g) < 1 for g in groups):
        return {"error": "H1 requires non-empty groups for every triage level."}
 
    normality = [check_normality(g, name) for g, name in zip(groups, group_names)]
    size_check = check_sample_size(groups, group_names)
 
    kw = weighted_kruskal_wallis(groups, weights, group_names)
    post_hoc = dunn_post_hoc(groups, weights, group_names, kw)
    reject = kw["reject_null"]
 
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
        for name, g, w in zip(group_names, groups, weights) if g
    ]
 
    return {
        "hypothesis": "H1",
        "research_question": "How does the reported median ED length of stay vary across CTAS triage levels?",
        "null_hypothesis": "Median LOS is equal across CTAS triage levels.",
        "alternative_hypothesis": "Median LOS differs across CTAS triage levels.",
        "statistical_method": STATISTICAL_METHOD,
        "assumption_checks": {
            "normality": normality,
            "sample_size": size_check,
            "normality_required": False,  # Kruskal-Wallis is distribution-free
        },
        "results": {
            "h_statistic": kw["h_statistic"], "degrees_of_freedom": kw["degrees_of_freedom"],
            "p_value": kw["p_value"], "weighted_n": kw["weighted_n"], "tie_correction": kw["tie_correction"],
            "epsilon_squared": kw["epsilon_squared"], "reject_null": reject, "decision": kw["decision"],
        },
        "interpretation": "Statistically significant differences observed across CTAS triage levels." if reject
                           else "No statistically significant difference across CTAS triage levels.",
        "clinical_insight": "Triage-level urgency is a strong predictor of LOS." if reject else "No independent effect.",
        "operational_recommendation": "Prioritize high-acuity patient flow." if reject else "Investigate other factors.",
        "group_summaries": group_stats,
        "post_hoc_comparisons": post_hoc,
    }
 

if __name__ == "__main__":
    import json
    import pandas as pd
 
    df = pd.read_csv("/mnt/project/CTAS_Triage.csv")
    # The report's narrative focuses on the three acute CTAS levels; drop this filter
    # to run the full six-level comparison instead.
    df = df[df.triage_level.isin(
        ["CTAS I - Resuscitation", "CTAS II - Emergent", "CTAS III - Urgent"]
    )]
 
    groups, weights, names = [], [], []
    for level, g in df.groupby("triage_level", sort=False):
        groups.append(g["median_los_hours"].tolist())
        weights.append(g["ed_visits"].astype(float).tolist())
        names.append(level)
 
    result = run(groups, names, weights)
    print(json.dumps(result, indent=2, default=str))