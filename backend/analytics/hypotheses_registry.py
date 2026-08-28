"""
Healthcare Analytics Platform — Hypothesis Registry
====================================================
Single authoritative source for hypothesis definitions, methods, and metadata.

All hypothesis IDs, research questions, null/alternative hypotheses, statistical
methods, data sources, and effect-size metrics are defined here exactly once.
Every other module (API routes, dashboard, reports, frontend contract) MUST import
from this file rather than re-stating definitions inline.

Hypotheses (final, locked definitions — DAMO-6994 Capstone):

  H1  CTAS Acuity and Length of Stay
      Weighted Kruskal-Wallis H-test with Dunn post-hoc (Bonferroni)
      Source table: ctas_triage | Effect size: epsilon_squared

  H2  Admission Status and Length of Stay
      Weighted Mann-Whitney U test
      Source table: visit_disposition | Effect size: rank_biserial

  H3  CTAS Urgency Score as a Predictor of Length of Stay
      Weighted Least Squares (WLS) linear regression
      Source table: ctas_triage | Effect size: r_squared

  H4  Age Group and Length of Stay
      Weighted Kruskal-Wallis H-test with Dunn post-hoc (Bonferroni)
      Source table: age_sex | Effect size: epsilon_squared

  H5  Sex and Visit Disposition — Association Test
      Pearson Chi-Square Test of Independence
      Source table: visit_disposition | Effect size: cramers_v
      Observation unit: aggregate visit counts (Female / Male) × (Admitted / Non-Admitted)
"""

from typing import Any, Dict

# ---------------------------------------------------------------------------
# Global analytical constants
# ---------------------------------------------------------------------------

ALPHA: float = 0.05                  # significance level, platform-wide
WEIGHT_COLUMN: str = "ed_visits"     # frequency-weight column in every aggregate table

# ---------------------------------------------------------------------------
# Canonical method labels (imported by API routes and /methods endpoint)
# ---------------------------------------------------------------------------

TEST_KRUSKAL:      str = "Weighted Kruskal-Wallis H-Test with Dunn Post-Hoc"
TEST_MANN_WHITNEY: str = "Weighted Mann-Whitney U Test"
TEST_WLS:          str = "Weighted Least Squares Linear Regression"
TEST_CHI_SQUARE:   str = "Pearson Chi-Square Test of Independence"

# ---------------------------------------------------------------------------
# Per-hypothesis definition blocks
# ---------------------------------------------------------------------------

HYPOTHESES: Dict[str, Dict[str, Any]] = {
    "H1": {
        "id": "H1",
        "title": "Reported Median ED LOS Across CTAS Triage Levels",
        "research_question": (
            "Does the reported median emergency department length of stay "
            "differ significantly across CTAS triage levels in Canadian NACRS aggregate data?"
        ),
        "null_hypothesis":        "Median LOS is equal across all CTAS triage acuity levels.",
        "alternative_hypothesis": "Median LOS differs across at least one pair of CTAS triage acuity levels.",
        "statistical_method": TEST_KRUSKAL,
        "effect_size_metric": "epsilon_squared",
        "post_hoc": "Dunn (Bonferroni-adjusted)",
        "source_table": "ctas_triage",
        "group_column":  "triage_level",
        "value_column":  "median_length_of_stay_min",
        "weight_column": WEIGHT_COLUMN,
        "cohort_scope_rule": (
            "Evaluates all 5 clinical CTAS acuity tiers: "
            "CTAS I (Resuscitation), CTAS II (Emergent), CTAS III (Urgent), "
            "CTAS IV (Less Urgent), CTAS V (Non-Urgent). "
            "Non-acuity records (Unknown / Not Stated) and summary roll-up rows (Total) "
            "are excluded from the acuity comparison."
        ),
    },
    "H2": {
        "id": "H2",
        "title": "Reported Median ED LOS by Admission Status (Admitted vs Non-Admitted)",
        "research_question": (
            "Does the reported median emergency department length of stay differ "
            "significantly between admitted and non-admitted ED visits?"
        ),
        "null_hypothesis":        "Median LOS is equal between admitted and non-admitted ED visits.",
        "alternative_hypothesis": "Median LOS differs between admitted and non-admitted ED visits.",
        "statistical_method": TEST_MANN_WHITNEY,
        "effect_size_metric": "rank_biserial",
        "post_hoc": None,
        "source_table": "visit_disposition",
        "group_column":  "is_admitted",          # binary: 1 = admitted, 0 = non-admitted
        "value_column":  "median_length_of_stay_min",
        "weight_column": WEIGHT_COLUMN,
        "cohort_scope_rule": (
            "Evaluates Admitted (is_admitted=1) vs Non-Admitted (is_admitted=0) records. "
            "Summary roll-up rows ('Total') and unclassified categories ('Unknown') are excluded. "
            "The test is binary: only two groups."
        ),
    },
    "H3": {
        "id": "H3",
        "title": "CTAS Urgency Score as a Predictor of Reported Median ED LOS (WLS Regression)",
        "research_question": (
            "Does the CTAS urgency score significantly predict the reported median "
            "emergency department length of stay in Canadian NACRS aggregate data?"
        ),
        "null_hypothesis":        "The CTAS urgency score does not significantly predict median LOS (β₁ = 0).",
        "alternative_hypothesis": "The CTAS urgency score significantly predicts median LOS (β₁ ≠ 0).",
        "statistical_method": TEST_WLS,
        "effect_size_metric": "r_squared",
        "post_hoc": None,
        "source_table": "ctas_triage",
        "x_column":      "ctas_urgency_score",
        "y_column":      "median_length_of_stay_min",
        "weight_column": WEIGHT_COLUMN,
        "cohort_scope_rule": (
            "Weighted Least Squares regression where ed_visits serves as the analytic weight. "
            "Only records with valid ctas_urgency_score and positive ed_visits are included."
        ),
    },
    "H4": {
        "id": "H4",
        "title": "Reported Median ED LOS Across Broad Age Categories",
        "research_question": (
            "Does the reported median emergency department length of stay differ "
            "significantly across broad age categories?"
        ),
        "null_hypothesis":        "Median LOS is equal across all broad age categories.",
        "alternative_hypothesis": "Median LOS differs across at least one pair of broad age categories.",
        "statistical_method": TEST_KRUSKAL,
        "effect_size_metric": "epsilon_squared",
        "post_hoc": "Dunn (Bonferroni-adjusted)",
        "source_table": "age_sex",
        "group_column":  "age_broad_category",
        "value_column":  "median_length_of_stay_min",
        "weight_column": WEIGHT_COLUMN,
        "cohort_scope_rule": (
            "Compares defined demographic life-stage cohorts: "
            "Pediatric & Youth, Young Adult, Middle Adult, Older Adult. "
            "Summary roll-up rows ('Total') and unclassified categories ('Unknown') are excluded."
        ),
    },
    "H5": {
        "id": "H5",
        "title": "Sex and Visit Disposition — Association (Chi-Square Test of Independence)",
        "research_question": (
            "Is there a statistically significant association between patient sex "
            "and visit disposition (admitted vs non-admitted) in Canadian NACRS aggregate data?"
        ),
        "null_hypothesis":        "Patient sex and visit disposition (admitted/non-admitted) are independent.",
        "alternative_hypothesis": "Patient sex and visit disposition are statistically associated.",
        "statistical_method": TEST_CHI_SQUARE,
        "effect_size_metric": "cramers_v",
        "post_hoc": None,
        "source_table": "visit_disposition",
        # Contingency axes:
        "row_dimension":   "sex",           # Female / Male
        "col_dimension":   "is_admitted",   # 0 = Non-Admitted, 1 = Admitted
        "count_column":    WEIGHT_COLUMN,   # aggregate visit counts as cell frequencies
        "cohort_scope_rule": (
            "Constructs a 2×2 contingency table from visit_disposition aggregate records. "
            "Rows = Sex (Female, Male); Columns = Disposition (Non-Admitted, Admitted). "
            "Cell values are summed ed_visits counts — aggregate visit frequencies, not "
            "individual patient records. Summary rows (sex IN ('Total','Total visits')) "
            "and records where is_admitted IS NULL are excluded. "
            "Cramér's V is computed as φ_c = √(χ²/N) for a 2×2 table."
        ),
    },
}


def get_hypothesis(h_id: str) -> Dict[str, Any]:
    """Return the definition block for a hypothesis by ID ('H1'–'H5')."""
    if h_id not in HYPOTHESES:
        raise KeyError(f"Unknown hypothesis ID: {h_id!r}. Valid IDs: {list(HYPOTHESES)}")
    return HYPOTHESES[h_id]


def methods_payload() -> Dict[str, Any]:
    """
    Canonical payload for GET /api/statistics/methods.
    Replaces any hardcoded method list in the API router.
    """
    return {
        "alpha": ALPHA,
        "weighting": {
            "applied": True,
            "weight_column": WEIGHT_COLUMN,
            "rationale": (
                "Rows are aggregate records each carrying an ed_visits count. "
                "ed_visits is treated as a frequency weight so that tests run over "
                "the weight-expanded population (N in the hundreds of millions) "
                "rather than over the small number of aggregate rows."
            ),
        },
        "engine": "backend.analytics.statistics.weighted",
        "methods": {
            h_id: {
                "test":            defn["statistical_method"],
                "effect_size":     defn["effect_size_metric"],
                "post_hoc":        defn["post_hoc"],
                "source_table":    defn["source_table"],
                "null_hypothesis": defn["null_hypothesis"],
            }
            for h_id, defn in HYPOTHESES.items()
        },
        "p_value_computation": (
            "Exact chi-square / normal survival functions (pure Python, SciPy-independent)"
        ),
        "tie_handling": (
            "Midrank assignment with 1 - Σ(t³ - t) / (N³ - N) correction"
        ),
    }
