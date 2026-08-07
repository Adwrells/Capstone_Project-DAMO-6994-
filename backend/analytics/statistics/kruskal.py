import math
from typing import List, Tuple, Dict, Any

def kruskal_wallis(*groups: List[float]) -> Tuple[float, float]:
    all_data = []
    group_sizes = []
    for g in groups:
        all_data.extend(g)
        group_sizes.append(len(g))
    n_total = len(all_data)
    if n_total < 3 or len(groups) < 2:
        return 0.0, 1.0
    sorted_unique = sorted(set(all_data))
    rank_map: Dict[float, float] = {}
    pos = 1
    for val in sorted_unique:
        count = all_data.count(val)
        rank_map[val] = (pos + pos + count - 1) / 2.0
        pos += count
    ranks = [rank_map[v] for v in all_data]
    h_sum = 0.0
    start = 0
    for size in group_sizes:
        g_ranks = ranks[start: start + size]
        if size > 0:
            h_sum += (sum(g_ranks) ** 2) / size
        start += size
    h_stat = (12.0 / (n_total * (n_total + 1))) * h_sum - 3.0 * (n_total + 1)
    df = len(groups) - 1
    if df <= 0 or h_stat <= 0:
        p_val = 1.0
    else:
        z = (pow(h_stat / df, 1/3) - (1 - 2/(9*df))) / math.sqrt(2/(9*df))
        p_val = max(0.0001, min(1.0, 2.0 * math.exp(-0.717 * abs(z) - 0.416 * z**2)))
    return round(float(h_stat), 4), round(float(p_val), 6)

def dunn_post_hoc(groups: List[List[float]], group_names: List[str]) -> List[Dict[str, Any]]:
    n_groups = len(groups)
    n_comparisons = (n_groups * (n_groups - 1)) // 2
    results = []
    for i in range(n_groups):
        for j in range(i + 1, n_groups):
            u_stat, p_raw = mann_whitney_u(groups[i], groups[j])
            p_adj = min(1.0, p_raw * n_comparisons)
            results.append({
                "group_a": group_names[i], "group_b": group_names[j],
                "u_statistic": round(float(u_stat), 4), "p_raw": round(float(p_raw), 6),
                "p_adj_bonferroni": round(float(p_adj), 6), "significant": bool(p_adj < 0.05),
            })
    return results

def mann_whitney_u(a: List[float], b: List[float]) -> Tuple[float, float]:
    n1, n2 = len(a), len(b)
    if n1 == 0 or n2 == 0:
        return 0.0, 1.0
    combined = list(a) + list(b)
    sorted_unique = sorted(set(combined))
    rank_map: Dict[float, float] = {}
    pos = 1
    for val in sorted_unique:
        count = combined.count(val)
        rank_map[val] = (pos + pos + count - 1) / 2.0
        pos += count
    r1 = sum(rank_map[v] for v in a)
    u1 = r1 - (n1 * (n1 + 1)) / 2.0
    u2 = n1 * n2 - u1
    u_stat = min(u1, u2)
    mu_u = (n1 * n2) / 2.0
    sigma_u = math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12.0)
    z = abs(u_stat - mu_u) / sigma_u if sigma_u > 0 else 0.0
    p_val = max(0.0001, min(1.0, 2.0 * math.exp(-0.717 * z - 0.416 * z**2)))
    return round(float(u_stat), 4), round(float(p_val), 6)
