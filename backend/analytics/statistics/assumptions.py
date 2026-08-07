import math
from typing import List, Dict, Any

def check_normality(values: List[float], label: str = "sample") -> Dict[str, Any]:
    n = len(values)
    if n < 3: return {"group": label, "is_normal": False, "reason": "n < 3", "n": n}
    mean = sum(values) / n
    var = sum((v - mean) ** 2 for v in values) / max(1, n - 1)
    std = math.sqrt(var) if var > 0 else 0.0
    if std == 0: return {"group": label, "is_normal": False, "reason": "Zero variance", "n": n}
    skewness = sum(((v - mean) / std) ** 3 for v in values) * n / max(1, (n - 1) * (n - 2))
    kurtosis = sum(((v - mean) / std) ** 4 for v in values) * n * (n + 1) / max(1, (n - 1) * (n - 2) * (n - 3)) - 3 * (n - 1) ** 2 / max(1, (n - 2) * (n - 3))
    is_normal = abs(skewness) < 2.0 and abs(kurtosis) < 7.0
    return {"group": label, "n": n, "mean": round(mean, 4), "std": round(std, 4), "skewness": round(skewness, 4), "kurtosis": round(kurtosis, 4), "is_normal": is_normal}

def check_sample_size(groups: List[List[float]], group_names: List[str], min_n: int = 5) -> Dict[str, Any]:
    sizes = {name: len(g) for name, g in zip(group_names, groups)}
    inadequate = [name for name, size in sizes.items() if size < min_n]
    return {"adequate": len(inadequate) == 0, "minimum_required": min_n, "group_sizes": sizes, "inadequate_groups": inadequate}
