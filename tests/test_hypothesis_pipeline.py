"""
Integration tests for the H1/H2/H4 pipeline against the seeded analytical database.

These assert the pipeline actually runs the WEIGHTED tests. The previous engine
advertised "Weighted Kruskal-Wallis" in its test_name while passing unweighted arrays
to scipy, so the headline defence here is: weighted_n must equal the summed visit
counts, not the aggregate row count.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import math
import unittest

from backend.analytics.hypothesis_testing import (
    EXCLUDED_CATEGORIES,
    VALID_CTAS_LEVELS,
    run_h1_test,
    run_h2_test,
    run_h4_test,
)
from backend.database.database_manager import db_manager


def _seeded(table: str) -> bool:
    try:
        return not db_manager.read_sql(f'SELECT 1 FROM "{table}" LIMIT 1').empty
    except Exception:
        return False


class HypothesisResultContract:
    """Shared contract every hypothesis result must satisfy."""

    def assert_common(self, res):
        for field in ("hypothesis", "test_name", "p_value", "reject_null", "decision",
                      "interpretation", "weighted_n", "group_summaries"):
            self.assertIn(field, res)
        self.assertNotIn("error", res)
        self.assertIsInstance(res["reject_null"], bool)
        self.assertGreaterEqual(res["p_value"], 0.0)
        self.assertLessEqual(res["p_value"], 1.0)
        self.assertIn(res["decision"], ("Reject H₀", "Fail to Reject H₀"))
        self.assertEqual(res["reject_null"], res["decision"] == "Reject H₀")

    def assert_weighting_applied(self, res):
        """weighted_n counts VISITS; n_records counts aggregate rows. They must differ."""
        total_records = sum(g["n_records"] for g in res["group_summaries"])
        total_weighted = sum(g["weighted_n"] for g in res["group_summaries"])
        self.assertEqual(res["weighted_n"], total_weighted)
        self.assertGreater(total_weighted, total_records * 100)


@unittest.skipUnless(_seeded("ctas_triage"), "ctas_triage not seeded")
class TestH1(unittest.TestCase, HypothesisResultContract):
    @classmethod
    def setUpClass(cls):
        cls.res = run_h1_test()

    def test_contract(self):
        self.assert_common(self.res)

    def test_weighting_applied(self):
        self.assert_weighting_applied(self.res)

    def test_reports_weighted_kruskal_fields(self):
        for field in ("h_statistic", "degrees_of_freedom", "epsilon_squared", "tie_correction"):
            self.assertIn(field, self.res)

    def test_cohort_scope_rule_is_explicit(self):
        self.assertIn("cohort_scope_rule", self.res)
        self.assertIn("CTAS I", self.res["cohort_scope_rule"])
        self.assertIn("Unknown", self.res["cohort_scope_rule"])

    def test_excludes_unknown_triage_level(self):
        groups = {g["triage_level"] for g in self.res["group_summaries"]}
        self.assertTrue(groups.issubset(set(VALID_CTAS_LEVELS)))
        self.assertNotIn("Unknown", groups)

    def test_degrees_of_freedom_matches_group_count(self):
        self.assertEqual(self.res["degrees_of_freedom"], len(self.res["group_summaries"]) - 1)

    def test_tie_correction_is_a_valid_proportion(self):
        """Must be in (0, 1]. The source notebook reported 1.0000001932 via int64 overflow."""
        self.assertGreater(self.res["tie_correction"], 0.0)
        self.assertLessEqual(self.res["tie_correction"], 1.0)

    def test_effect_size_bounded(self):
        self.assertGreaterEqual(self.res["epsilon_squared"], 0.0)
        self.assertLessEqual(self.res["epsilon_squared"], 1.0)

    def test_reproduces_notebook_result(self):
        """Anchored to backend/hypothesis testing/H1_testing.ipynb (N and effect size)."""
        self.assertEqual(self.res["weighted_n"], 174_207_395)
        self.assertAlmostEqual(self.res["epsilon_squared"], 0.7251, places=3)
        self.assertTrue(self.res["reject_null"])

    def test_dunn_post_hoc_covers_every_pair(self):
        k = len(self.res["group_summaries"])
        self.assertEqual(len(self.res["dunn_post_hoc"]), k * (k - 1) // 2)
        for pair in self.res["dunn_post_hoc"]:
            self.assertIn("z_score", pair)
            self.assertLessEqual(pair["p_raw"], pair["p_adj_bonferroni"])

    def test_group_summaries_carry_weighted_descriptives(self):
        for g in self.res["group_summaries"]:
            for field in ("triage_level", "n_records", "weighted_n",
                          "weighted_mean_los_min", "weighted_median_los_min"):
                self.assertIn(field, g)
            self.assertGreater(g["weighted_n"], 0)

    def test_acuity_ordering_is_clinically_coherent(self):
        """Resuscitation/Emergent should not rank below Non-urgent on LOS."""
        by_level = {g["triage_level"]: g["weighted_mean_los_min"] for g in self.res["group_summaries"]}
        if "CTAS I - Resuscitation" in by_level and "Non-urgent" in by_level:
            self.assertGreater(by_level["CTAS I - Resuscitation"], by_level["Non-urgent"])


@unittest.skipUnless(_seeded("visit_disposition"), "visit_disposition not seeded")
class TestH2(unittest.TestCase, HypothesisResultContract):
    @classmethod
    def setUpClass(cls):
        cls.res = run_h2_test()

    def test_contract(self):
        self.assert_common(self.res)

    def test_weighting_applied(self):
        self.assert_weighting_applied(self.res)

    def test_reports_mann_whitney_fields(self):
        for field in ("u_statistic", "z_score", "rank_biserial", "tie_correction"):
            self.assertIn(field, self.res)

    def test_rank_biserial_bounded(self):
        self.assertGreaterEqual(self.res["rank_biserial"], -1.0)
        self.assertLessEqual(self.res["rank_biserial"], 1.0)

    def test_two_disposition_groups(self):
        self.assertEqual(len(self.res["group_summaries"]), 2)
        self.assertEqual([g["group"] for g in self.res["group_summaries"]],
                         ["Admitted", "Non-Admitted"])

    def test_admitted_stay_longer(self):
        admitted, non_admitted = self.res["group_summaries"]
        self.assertGreater(admitted["weighted_mean_los_min"], non_admitted["weighted_mean_los_min"])

    def test_excludes_unknown_disposition(self):
        self.assertIn("Unknown", EXCLUDED_CATEGORIES)


@unittest.skipUnless(_seeded("age_sex"), "age_sex not seeded")
class TestH4(unittest.TestCase, HypothesisResultContract):
    @classmethod
    def setUpClass(cls):
        cls.res = run_h4_test()

    def test_contract(self):
        self.assert_common(self.res)

    def test_weighting_applied(self):
        self.assert_weighting_applied(self.res)

    def test_reports_weighted_kruskal_fields(self):
        for field in ("h_statistic", "degrees_of_freedom", "epsilon_squared", "tie_correction"):
            self.assertIn(field, self.res)

    def test_cohort_scope_rule_is_explicit(self):
        self.assertIn("cohort_scope_rule", self.res)
        self.assertIn("Total", self.res["cohort_scope_rule"])

    def test_group_summaries_use_age_category(self):
        for g in self.res["group_summaries"]:
            self.assertIn("age_category", g)
            self.assertIn("weighted_n", g)

    def test_dunn_post_hoc_covers_every_pair(self):
        k = len(self.res["group_summaries"])
        self.assertEqual(len(self.res["dunn_post_hoc"]), k * (k - 1) // 2)

    def test_tie_correction_is_a_valid_proportion(self):
        self.assertGreater(self.res["tie_correction"], 0.0)
        self.assertLessEqual(self.res["tie_correction"], 1.0)


class TestDeterminism(unittest.TestCase):
    @unittest.skipUnless(_seeded("ctas_triage"), "ctas_triage not seeded")
    def test_repeated_runs_agree(self):
        """No sampling, no capping - the same data must give bit-identical results."""
        a, b = run_h1_test(), run_h1_test()
        self.assertEqual(a["h_statistic"], b["h_statistic"])
        self.assertEqual(a["weighted_n"], b["weighted_n"])
        self.assertEqual(a["p_value"], b["p_value"])


class TestRollupCategoryFiltering(unittest.TestCase):
    """Task 01 Acceptance Criteria: Asserts rollup categories are filtered out upstream."""

    def test_filter_exact_rollup_labels(self):
        from backend.analytics.hypothesis_testing import ROLLUP_LABELS, is_rollup_or_excluded
        for label in ("Total", "TOTAL", "total", "All", "ALL", "all", "Any", "any", "Grand Total", "Overall"):
            self.assertTrue(is_rollup_or_excluded(label), f"Rollup label '{label}' should be excluded")

    def test_filter_does_not_exclude_legitimate_substrings(self):
        from backend.analytics.hypothesis_testing import is_rollup_or_excluded
        # Valid clinical strings with similar letters or substrings must not be falsely dropped
        legit_categories = [
            "Intra-Facility Transfer",
            "Discharged Home",
            "CTAS I - Resuscitation",
            "CTAS II - Emergent",
            "CTAS III - Urgent",
            "Less urgent",
            "Non-urgent",
            "Pediatric & Youth",
            "Geriatric Population",
            "Admitted",
            "Death",
        ]
        for cat in legit_categories:
            self.assertFalse(is_rollup_or_excluded(cat), f"Legitimate category '{cat}' must not be excluded")

    @unittest.skipUnless(_seeded("ctas_triage"), "ctas_triage not seeded")
    def test_h1_contains_no_rollup_in_groups_or_post_hoc(self):
        res = run_h1_test()
        groups = [g["triage_level"].lower() for g in res["group_summaries"]]
        for rollup in ("total", "all", "any", "grand total", "overall"):
            self.assertNotIn(rollup, groups)
        for pair in res.get("dunn_post_hoc", []):
            self.assertNotIn("total", pair["group_a"].lower())
            self.assertNotIn("total", pair["group_b"].lower())

    @unittest.skipUnless(_seeded("age_sex"), "age_sex not seeded")
    def test_h4_contains_no_rollup_in_groups_or_post_hoc(self):
        res = run_h4_test()
        groups = [g["age_category"].lower() for g in res["group_summaries"]]
        for rollup in ("total", "all", "any", "grand total", "overall"):
            self.assertNotIn(rollup, groups)
        for pair in res.get("dunn_post_hoc", []):
            self.assertNotIn("total", pair["group_a"].lower())
            self.assertNotIn("total", pair["group_b"].lower())


class TestStalenessAndLiveQueryReconciliation(unittest.TestCase):
    """Task 07: Live query reconciliation & staleness validation guard.
    
    Verifies that all hypothesis group sizes (aggregate record count & weighted visit sum)
    computed by the solver match exact live queries against the underlying database tables.
    Fails loudly if cached/stale values drift from live data.
    """

    @unittest.skipUnless(_seeded("ctas_triage"), "ctas_triage not seeded")
    def test_h1_live_query_reconciliation(self):
        # Direct SQL aggregation on live table
        df = db_manager.read_sql(
            """
            SELECT triage_level, COUNT(*) as n_records, SUM(ed_visits) as total_visits
            FROM ctas_triage
            WHERE ed_visits > 0
              AND triage_level NOT IN ('Unknown', 'Total', 'All', 'Grand Total')
              AND median_length_of_stay_min IS NOT NULL
            GROUP BY triage_level
            """
        )
        sql_map = {row["triage_level"]: (int(row["n_records"]), int(row["total_visits"])) for _, row in df.iterrows()}
        
        res = run_h1_test()
        solver_map = {g["triage_level"]: (g["n_records"], g["weighted_n"]) for g in res["group_summaries"]}
        
        # Must have exactly 5 clinical CTAS tiers
        self.assertEqual(len(solver_map), 5)
        for level, (exp_records, exp_visits) in sql_map.items():
            self.assertIn(level, solver_map, f"Missing CTAS tier {level} in H1 solver output")
            act_records, act_visits = solver_map[level]
            self.assertEqual(act_records, exp_records, f"Record count drift for CTAS tier {level}")
            self.assertEqual(act_visits, exp_visits, f"Weighted visit count drift for CTAS tier {level}")

    @unittest.skipUnless(_seeded("visit_disposition"), "visit_disposition not seeded")
    def test_h2_live_query_reconciliation(self):
        # Direct SQL aggregation for admission groups
        df = db_manager.read_sql(
            """
            SELECT is_admitted, COUNT(*) as n_records, SUM(ed_visits) as total_visits
            FROM visit_disposition
            WHERE ed_visits > 0
              AND visit_disposition NOT IN ('Unknown', 'Total', 'All', 'Grand Total')
              AND is_admitted IS NOT NULL
              AND median_length_of_stay_min IS NOT NULL
            GROUP BY is_admitted
            """
        )
        sql_totals = {int(row["is_admitted"]): (int(row["n_records"]), int(row["total_visits"])) for _, row in df.iterrows()}
        
        res = run_h2_test()
        # Admitted is group 0, Non-Admitted is group 1
        admitted = res["admitted_summary"]
        non_admitted = res["discharged_summary"]
        
        self.assertEqual(admitted["n_records"], sql_totals[1][0], "H2 Admitted record count drift")
        self.assertEqual(admitted["weighted_n"], sql_totals[1][1], "H2 Admitted visit count drift")
        self.assertEqual(non_admitted["n_records"], sql_totals[0][0], "H2 Non-Admitted record count drift")
        self.assertEqual(non_admitted["weighted_n"], sql_totals[0][1], "H2 Non-Admitted visit count drift")

    @unittest.skipUnless(_seeded("age_sex"), "age_sex not seeded")
    def test_h4_live_query_reconciliation(self):
        # Direct SQL aggregation for broad age categories
        df = db_manager.read_sql(
            """
            SELECT age_broad_category, COUNT(*) as n_records, SUM(ed_visits) as total_visits
            FROM age_sex
            WHERE ed_visits > 0
              AND age_broad_category NOT IN ('Unknown', 'Total', 'All', 'Grand Total')
              AND median_length_of_stay_min IS NOT NULL
            GROUP BY age_broad_category
            """
        )
        sql_map = {row["age_broad_category"]: (int(row["n_records"]), int(row["total_visits"])) for _, row in df.iterrows()}
        
        res = run_h4_test()
        solver_map = {g["age_category"]: (g["n_records"], g["weighted_n"]) for g in res["group_summaries"]}
        
        for cat, (exp_records, exp_visits) in sql_map.items():
            self.assertIn(cat, solver_map, f"Missing age category {cat} in H4 solver output")
            act_records, act_visits = solver_map[cat]
            self.assertEqual(act_records, exp_records, f"Record count drift for age category {cat}")
            self.assertEqual(act_visits, exp_visits, f"Weighted visit count drift for age category {cat}")


if __name__ == "__main__":
    unittest.main()
