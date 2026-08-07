import math
from typing import List, Tuple, Dict, Any

def chi_square_test(observed_matrix: List[List[int]]) -> Tuple[float, int, float]:
    if not observed_matrix or not observed_matrix[0]: return 0.0, 0, 1.0
    n_rows, n_cols = len(observed_matrix), len(observed_matrix[0])
    row_sums = [sum(row) for row in observed_matrix]
    col_sums = [sum(observed_matrix[r][c] for r in range(n_rows)) for c in range(n_cols)]
    total = sum(row_sums)
    if total == 0: return 0.0, 0, 1.0
    chi2 = 0.0
    for r in range(n_rows):
        for c in range(n_cols):
            exp = (row_sums[r] * col_sums[c]) / total
            if exp > 0: chi2 += ((observed_matrix[r][c] - exp) ** 2) / exp
    df = (n_rows - 1) * (n_cols - 1)
    p_val = max(0.0001, min(1.0, 1.0 / (1.0 + chi2 / max(1, df))))
    return round(chi2, 4), df, round(p_val, 6)

def chi_square_summary(observed_matrix: List[List[int]], row_labels: List[str], col_labels: List[str]) -> Dict[str, Any]:
    chi2, df, p_val = chi_square_test(observed_matrix)
    reject = p_val < 0.05
    return {
        "test": "Pearson Chi-Square Test of Independence",
        "chi2_statistic": chi2, "degrees_of_freedom": df, "p_value": p_val,
        "reject_null": reject, "decision": "Reject H₀" if reject else "Fail to Reject H₀",
        "row_labels": row_labels, "col_labels": col_labels, "observed_matrix": observed_matrix,
    }
