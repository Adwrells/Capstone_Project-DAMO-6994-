import math
from typing import List, Tuple, Dict, Any

def one_way_anova(*groups: List[float]) -> Tuple[float, float]:
    k = len(groups)
    if k < 2: return 0.0, 1.0
    all_vals = [v for g in groups for v in g]
    n_total = len(all_vals)
    if n_total < k + 1: return 0.0, 1.0
    grand_mean = sum(all_vals) / n_total
    ss_between = sum(len(g) * ((sum(g) / len(g)) - grand_mean) ** 2 for g in groups if len(g) > 0)
    df_between = k - 1
    ss_within = sum((v - (sum(g) / len(g))) ** 2 for g in groups if len(g) > 0 for v in g)
    df_within = n_total - k
    if df_within <= 0 or ss_within == 0: return 0.0, 1.0
    ms_between = ss_between / df_between
    ms_within = ss_within / df_within
    f_stat = ms_between / ms_within if ms_within > 0 else 0.0
    p_val = max(0.0001, min(1.0, 1.0 / (1.0 + f_stat)))
    return round(float(f_stat), 4), round(float(p_val), 6)
