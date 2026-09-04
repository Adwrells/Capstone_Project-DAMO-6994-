"""
Healthcare Analytics Platform - Analytics: Hypothesis Testing Engine
Executes non-parametric statistical hypothesis tests from SQLite analytical tables:
- H1: Weighted Kruskal-Wallis & Dunn Post Hoc (CTAS Triage Levels)
- H2: Weighted Mann-Whitney U (Visit Disposition: Admitted vs Non-Admitted)
- H4: Weighted Kruskal-Wallis & Dunn Post Hoc (Age Groups)
- H5: Pearson Chi-Square Test of Independence (Sex × Admission Status)

Weighting
---------
Every row in these tables is an AGGREGATE: a reported median LOS plus the number of ED
visits it summarises. ``ed_visits`` is therefore a frequency weight, and the tests are
run over the weight-expanded population (N in the hundreds of millions) rather than over
the few hundred aggregate rows. All ranking, tie correction, and p-value computation is
delegated to backend.analytics.statistics.weighted, which is the single definition of
these tests across the platform.
"""

import math
from typing import Any, Dict, List, Optional, Sequence, Tuple

import math

import pandas as pd

from backend.analytics.statistics.weighted import (
    weighted_dunn_post_hoc,
    weighted_kruskal_wallis,
    weighted_mann_whitney_u,
    weighted_mean,
    weighted_median,
)
from backend.database.database_manager import db_manager

ALPHA = 0.05

# CTAS levels carrying a defined acuity. "Unknown" is a reporting artefact, not a
# triage decision, so it cannot participate in an acuity-ordered comparison.
VALID_CTAS_LEVELS: List[str] = [
    "CTAS I - Resuscitation",
    "CTAS II - Emergent",
    "CTAS III - Urgent",
    "Less urgent",
    "Non-urgent",
]

# Rollup and aggregate labels fabricated/derived from rollups, excluded from all group comparisons
ROLLUP_LABELS: Tuple[str, ...] = (
    "Total",
    "TOTAL",
    "All",
    "ALL",
    "Any",
    "ANY",
    "Grand Total",
    "GRAND TOTAL",
    "Overall",
    "OVERALL",
    "Total Visits",
    "Total visits",
)

# Categories excluded platform-wide: they denote missing classification or roll-ups, not distinct cohorts.
EXCLUDED_CATEGORIES: Tuple[str, ...] = (
    "Unknown",
    "Not Stated",
    "Missing",
    "None",
    "",
    *ROLLUP_LABELS,
)

# Canonical set of lowercase labels for strict case-insensitive exact matching
EXCLUDED_CATEGORIES_LOWER: set = {c.strip().lower() for c in EXCLUDED_CATEGORIES}

TEST_KRUSKAL = "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc"
TEST_MANN_WHITNEY = "Weighted Mann-Whitney U Test"


def is_rollup_or_excluded(label: Any) -> bool:
    """Case-insensitive exact match against rollup labels and missing placeholders.
    
    Guarantees that exact matches like 'Total', 'All', 'Unknown' are excluded,
    while avoiding false positives on substring matches (e.g. 'Intra-Facility Transfer').
    """
    if label is None:
        return True
    return str(label).strip().lower() in EXCLUDED_CATEGORIES_LOWER


_is_excluded = is_rollup_or_excluded


def _clean_frame(df: pd.DataFrame, group_col: str, value_col: str, weight_col: str) -> pd.DataFrame:
    """Drops unusable rows: missing keys, non-positive weights, negative LOS, placeholders, and rollups."""
    out = df.dropna(subset=[group_col, value_col, weight_col]).copy()
    out = out[(out[weight_col] > 0) & (out[value_col] >= 0)]
    return out[~out[group_col].map(is_rollup_or_excluded)]


def _split_groups(
    df: pd.DataFrame,
    group_col: str,
    value_col: str,
    weight_col: str,
    order: Optional[Sequence[str]] = None,
) -> Tuple[List[List[float]], List[str], List[List[float]]]:
    """Splits a frame into parallel value/name/weight lists, honouring a display order."""
    present = list(df[group_col].unique())
    names = [g for g in order if g in present] if order else sorted(present, key=str)

    groups: List[List[float]] = []
    weights: List[List[float]] = []
    kept: List[str] = []
    for name in names:
        sub = df[df[group_col] == name]
        if sub.empty:
            continue
        groups.append([float(v) for v in sub[value_col]])
        weights.append([float(w) for w in sub[weight_col]])
        kept.append(str(name))
    return groups, kept, weights


def _summarise(name_key: str, names: Sequence[str], groups, weights) -> List[Dict[str, Any]]:
    """Builds the per-group descriptive block returned to the API."""
    return [
        {
            name_key: name,
            "n_records": len(vals),
            "weighted_n": int(sum(wts)),
            "total_visits": int(sum(wts)),  # retained for backwards compatibility
            "weighted_mean_los_min": round(weighted_mean(vals, wts), 2),
            "weighted_median_los_min": round(weighted_median(vals, wts), 2),
            "min_los_min": round(min(vals), 2),
            "max_los_min": round(max(vals), 2),
        }
        for name, vals, wts in zip(names, groups, weights)
    ]


def _effect_label(epsilon_squared: float) -> str:
    """Cohen-style banding for epsilon-squared."""
    if epsilon_squared < 0.01:
        return "Negligible"
    if epsilon_squared < 0.06:
        return "Small"
    if epsilon_squared < 0.14:
        return "Medium"
    return "Large"


def run_h1_test() -> Dict[str, Any]:
    """
    H1 Hypothesis Test: Evaluates whether Length of Stay (LOS) differs significantly
    across CTAS Triage Levels using Weighted Kruskal-Wallis test and Dunn's Post-Hoc analysis.
    """
    df = db_manager.read_sql(
        "SELECT triage_level, median_length_of_stay_min, ed_visits, ctas_urgency_score "
        "FROM ctas_triage WHERE ed_visits > 0"
    )
    if df.empty:
        return {"error": "No records found in ctas_triage table."}

    clean = _clean_frame(df, "triage_level", "median_length_of_stay_min", "ed_visits")
    if clean.empty:
        return {"error": "No valid CTAS records remain after cleaning."}

    groups, names, weights = _split_groups(
        clean, "triage_level", "median_length_of_stay_min", "ed_visits", VALID_CTAS_LEVELS
    )
    if len(groups) < 2:
        return {"error": "Insufficient groups for Kruskal-Wallis test."}

    kw = weighted_kruskal_wallis(groups, names, weights)
    dunn = weighted_dunn_post_hoc(groups, names, weights, alpha=ALPHA)
    reject = kw["reject_null"]

    return {
        "hypothesis": "H1: Length of Stay differs significantly across CTAS Triage Levels",
        "cohort_scope_rule": (
            "Compares all 5 defined clinical CTAS acuity tiers: CTAS I (Resuscitation), "
            "CTAS II (Emergent), CTAS III (Urgent), CTAS IV (Less Urgent), and CTAS V (Non-Urgent). "
            "Unknown / Not Stated non-acuity records and summary roll-up rows ('Total') are excluded."
        ),
        "test_name": TEST_KRUSKAL,
        "h_statistic": round(kw["h_statistic"], 4),
        "degrees_of_freedom": kw["degrees_of_freedom"],
        "p_value": kw["p_value"],
        "alpha": ALPHA,
        "weighted_n": kw["weighted_n"],
        "tie_correction": kw["tie_correction"],
        "epsilon_squared": round(kw["epsilon_squared"], 6),
        "effect_size_magnitude": _effect_label(kw["epsilon_squared"]),
        "reject_null": reject,
        "decision": kw["decision"],
        "interpretation": (
            "Statistically significant difference in length of stay observed across CTAS "
            "triage levels (p < 0.05)."
            if reject else
            "No statistically significant difference detected across triage levels."
        ),
        "excluded_categories": [c for c in df["triage_level"].dropna().unique() if _is_excluded(c)],
        "group_summaries": _summarise("triage_level", names, groups, weights),
        "dunn_post_hoc": dunn,
    }


def run_h2_test() -> Dict[str, Any]:
    """
    H2 Hypothesis Test: Evaluates whether Length of Stay differs significantly
    between Admitted vs Non-Admitted ED visits using Weighted Mann-Whitney U test.
    """
    df = db_manager.read_sql(
        "SELECT is_admitted, visit_disposition, median_length_of_stay_min, ed_visits "
        "FROM visit_disposition WHERE ed_visits > 0"
    )
    if df.empty:
        return {"error": "No records found in visit_disposition table."}

    clean = _clean_frame(df, "visit_disposition", "median_length_of_stay_min", "ed_visits")
    clean = clean.dropna(subset=["is_admitted"])
    if clean.empty:
        return {"error": "No valid disposition records remain after cleaning."}

    admitted = clean[clean["is_admitted"] == 1]
    non_admitted = clean[clean["is_admitted"] == 0]
    if len(admitted) < 2 or len(non_admitted) < 2:
        return {"error": "Insufficient sample size for Mann-Whitney U test."}

    a_vals = [float(v) for v in admitted["median_length_of_stay_min"]]
    a_wts = [float(w) for w in admitted["ed_visits"]]
    n_vals = [float(v) for v in non_admitted["median_length_of_stay_min"]]
    n_wts = [float(w) for w in non_admitted["ed_visits"]]

    mw = weighted_mann_whitney_u(
        a_vals, n_vals, a_wts, n_wts, label_a="Admitted", label_b="Non-Admitted"
    )
    reject = mw["reject_null"]

    summaries = _summarise(
        "group", ["Admitted", "Non-Admitted"], [a_vals, n_vals], [a_wts, n_wts]
    )

    return {
        "hypothesis": "H2: Length of Stay differs significantly between Admitted and Non-Admitted ED Visits",
        "cohort_scope_rule": (
            "Evaluates Admitted vs Non-Admitted visit disposition records. "
            "Summary roll-up rows ('Total') and unclassified categories ('Unknown') are excluded."
        ),
        "test_name": TEST_MANN_WHITNEY,
        "u_statistic": round(mw["u_statistic"], 4),
        "z_score": round(mw["z_score"], 4),
        "p_value": mw["p_value"],
        "alpha": ALPHA,
        "weighted_n": mw["weighted_n"],
        "tie_correction": mw["tie_correction"],
        "rank_biserial": round(mw["rank_biserial"], 6),
        "reject_null": reject,
        "decision": mw["decision"],
        "interpretation": (
            "Admitted patients experience significantly higher length of stay than "
            "non-admitted patients (p < 0.05)."
            if reject else
            "No statistically significant difference in stay length between admission groups."
        ),
        "excluded_categories": [
            c for c in df["visit_disposition"].dropna().unique() if _is_excluded(c)
        ],
        "group_summaries": summaries,
        # Retained so existing consumers keep working.
        "admitted_summary": summaries[0],
        "discharged_summary": summaries[1],
    }


def run_h4_test() -> Dict[str, Any]:
    """
    H4 Hypothesis Test: Evaluates whether Length of Stay differs significantly
    across Patient Age Groups using Weighted Kruskal-Wallis test and Dunn's Post-Hoc.
    """
    df = db_manager.read_sql(
        "SELECT age_group, age_broad_category, median_length_of_stay_min, ed_visits "
        "FROM age_sex WHERE ed_visits > 0"
    )
    if df.empty:
        return {"error": "No records found in age_sex table."}

    clean = _clean_frame(df, "age_broad_category", "median_length_of_stay_min", "ed_visits")
    if clean.empty:
        return {"error": "No valid age records remain after cleaning."}

    # Life-stage order, so post-hoc pairs read youngest -> oldest rather than alphabetically.
    age_order = [
        "Pediatric & Youth",
        "Young Adult",
        "Middle Adult",
        "Older Adult",
        "Pediatric Population",
        "Young Adult Population",
        "Adult Population",
        "Pre-Senior Population",
        "Geriatric Population",
    ]
    observed = list(clean["age_broad_category"].unique())
    order = [a for a in age_order if a in observed] + sorted(
        [a for a in observed if a not in age_order], key=str
    )

    groups, names, weights = _split_groups(
        clean, "age_broad_category", "median_length_of_stay_min", "ed_visits", order
    )
    if len(groups) < 2:
        return {"error": "Insufficient age categories for Kruskal-Wallis test."}

    kw = weighted_kruskal_wallis(groups, names, weights)
    dunn = weighted_dunn_post_hoc(groups, names, weights, alpha=ALPHA)
    reject = kw["reject_null"]

    return {
        "hypothesis": "H4: Length of Stay differs significantly across Age Groups",
        "cohort_scope_rule": (
            "Compares defined demographic life-stage cohorts across the population. "
            "Summary roll-up rows ('Total') and unclassified categories ('Unknown') are excluded."
        ),
        "test_name": TEST_KRUSKAL,
        "h_statistic": round(kw["h_statistic"], 4),
        "degrees_of_freedom": kw["degrees_of_freedom"],
        "p_value": kw["p_value"],
        "alpha": ALPHA,
        "weighted_n": kw["weighted_n"],
        "tie_correction": kw["tie_correction"],
        "epsilon_squared": round(kw["epsilon_squared"], 6),
        "effect_size_magnitude": _effect_label(kw["epsilon_squared"]),
        "reject_null": reject,
        "decision": kw["decision"],
        "interpretation": (
            "Statistically significant difference in length of stay observed across age "
            "categories (p < 0.05)."
            if reject else
            "No statistically significant difference detected across age categories."
        ),
        "excluded_categories": [
            c for c in df["age_broad_category"].dropna().unique() if _is_excluded(c)
        ],
        "group_summaries": _summarise("age_category", names, groups, weights),
        "dunn_post_hoc": dunn,
    }


def _cramers_v(chi2: float, n: float, n_rows: int, n_cols: int) -> float:
    """Cramér's V effect size for chi-square tests."""
    if n <= 0 or chi2 < 0:
        return 0.0
    k = min(n_rows, n_cols) - 1
    if k <= 0:
        return 0.0
    return math.sqrt(chi2 / (n * k))


def run_h5_test() -> Dict[str, Any]:
    """
    H5 Hypothesis Test: Pearson Chi-Square Test of Independence.
    Evaluates whether patient sex is associated with visit disposition
    (admitted vs non-admitted) using aggregate visit counts from visit_disposition.

    Contingency table:
        Rows = Sex (Female, Male)
        Cols = Disposition (Non-Admitted [is_admitted=0], Admitted [is_admitted=1])
        Cell values = sum(ed_visits) — aggregate visit frequencies

    Note: The contingency table is built from aggregate records, not individual
    patient records. Each cell aggregates the total reported visits across all
    disposition-sex-fiscal_year combinations in the source table.
    """
    from backend.analytics.hypothesis.H5 import run as h5_run

    df = db_manager.read_sql(
        """
        SELECT sex, is_admitted, SUM(ed_visits) as visit_count
        FROM visit_disposition
        WHERE sex NOT IN ('Total', 'Total visits', 'Unknown', 'Not Stated', 'Missing')
          AND is_admitted IS NOT NULL
          AND ed_visits > 0
        GROUP BY sex, is_admitted
        ORDER BY sex, is_admitted
        """
    )

    if df.empty:
        return {"error": "No valid sex x admission records found in visit_disposition table."}

    sexes = sorted(df["sex"].unique().tolist())
    col_labels = ["Non-Admitted", "Admitted"]   # is_admitted=0, is_admitted=1

    # Build 2-D matrix: rows = sexes, cols = [Non-Admitted, Admitted]
    observed_matrix: List[List[int]] = []
    missing_cells: List[str] = []
    for sex in sexes:
        sex_rows = df[df["sex"] == sex]
        row: List[int] = []
        for admitted_flag in [0, 1]:
            cell_rows = sex_rows[sex_rows["is_admitted"] == admitted_flag]
            if cell_rows.empty:
                missing_cells.append(f"{sex} x {'Admitted' if admitted_flag else 'Non-Admitted'}")
                row.append(0)
            else:
                row.append(int(cell_rows["visit_count"].iloc[0]))
        observed_matrix.append(row)

    if not sexes or not observed_matrix:
        return {"error": "Could not construct contingency table from visit_disposition."}

    # Call the canonical H5 module
    h5_result = h5_run(observed_matrix, sexes, col_labels)

    # Enrich with Cramér's V, total N, and structured cohort metadata
    total_n = sum(cell for row in observed_matrix for cell in row)
    chi2 = h5_result.get("results", {}).get("chi2_statistic", 0.0)
    n_rows, n_cols = len(observed_matrix), len(col_labels)
    cv = _cramers_v(chi2, total_n, n_rows, n_cols)

    h5_result["total_visits_analyzed"] = total_n
    h5_result["cramers_v"] = round(cv, 6)
    h5_result["effect_size_magnitude"] = (
        "Negligible" if cv < 0.10 else
        "Small"      if cv < 0.30 else
        "Medium"     if cv < 0.50 else
        "Large"
    )
    if missing_cells:
        h5_result["missing_cells_warning"] = missing_cells

    h5_result["cohort_scope_rule"] = (
        "2x2 contingency table: Sex (Female, Male) x Disposition (Non-Admitted, Admitted). "
        "Cell values are summed ed_visits across all matching records in visit_disposition. "
        "Summary rows (sex IN ('Total', 'Total visits')) and NULL is_admitted records are excluded. "
        "Observation unit is aggregate visit counts, not individual patients."
    )
    h5_result["source_table"] = "visit_disposition"
    h5_result["alpha"] = ALPHA

    return h5_result
