from typing import Dict, Any, List
from backend.analytics.statistics.chi_square import chi_square_summary
 
def run(observed_matrix: List[List[int]], row_labels: List[str], col_labels: List[str]) -> Dict[str, Any]:
    if not observed_matrix or not observed_matrix[0]:
        return {"error": "H5 requires valid contingency table."}
    n_rows, n_cols = len(observed_matrix), len(observed_matrix[0])
    row_sums = [sum(row) for row in observed_matrix]
    col_sums = [sum(observed_matrix[r][c] for r in range(n_rows)) for c in range(n_cols)]
    total = sum(row_sums)
    low_expected = []
    for r in range(n_rows):
        for c in range(n_cols):
            exp = (row_sums[r] * col_sums[c]) / total if total > 0 else 0
            if exp < 5: low_expected.append(f"{row_labels[r]} x {col_labels[c]}")
    res = chi_square_summary(observed_matrix, row_labels, col_labels)
    reject = res["reject_null"]
    return {
        "hypothesis": "H5", "research_question": "Is there a significant association between Patient Sex and Visit Disposition?",
        "null_hypothesis": "Patient sex and visit disposition are independent.", "alternative_hypothesis": "Patient sex and visit disposition are associated.",
        "statistical_method": "Pearson Chi-Square Test of Independence",
        "assumption_checks": {"minimum_expected_frequency": 5, "cells_below_threshold": low_expected, "assumption_met": len(low_expected) == 0},
        "results": {"chi2_statistic": res["chi2_statistic"], "degrees_of_freedom": res["degrees_of_freedom"], "p_value": res["p_value"], "reject_null": reject, "decision": res["decision"]},
        "interpretation": "Statistically significant association detected." if reject else "No significant association.",
        "clinical_insight": "Sex-based differences in admission rates." if reject else "No sex effect.",
        "operational_recommendation": "Stratify admission rate monitoring by sex." if reject else "Focus on other factors.",
        "contingency_table": {"row_labels": row_labels, "col_labels": col_labels, "observed": observed_matrix},
    }
 