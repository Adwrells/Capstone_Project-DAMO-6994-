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


class TestEmptyDatabaseHandling(unittest.TestCase):
    """The engines must degrade to an error dict, never raise, on an unseeded table."""

    def test_missing_table_returns_error(self):
        from backend.analytics import hypothesis_testing as ht

        class EmptyDB:
            def read_sql(self, *a, **k):
                import pandas as pd
                return pd.DataFrame()

        original = ht.db_manager
        ht.db_manager = EmptyDB()
        try:
            for runner in (ht.run_h1_test, ht.run_h2_test, ht.run_h4_test):
                res = runner()
                self.assertIn("error", res)
        finally:
            ht.db_manager = original


if __name__ == "__main__":
    unittest.main()
