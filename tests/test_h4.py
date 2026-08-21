import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.hypothesis import H4
from backend.database.database_manager import db_manager

# The categories actually stored in age_sex.age_broad_category. Anchoring the tests to
# the real vocabulary keeps them honest: the previous fixture used labels
# ("Middle Adult", "Older Adult") that appear nowhere in the schema.
AGE_CATEGORIES = [
    "Pediatric & Youth",
    "Young Adult",
    "Middle Adult",
    "Older Adult",
]


class TestH4Module(unittest.TestCase):
    def test_h4_run_rejects_null_when_significant(self):
        g = [
            [10.0, 11.0, 10.5, 9.5, 10.2, 10.8, 11.2, 9.8, 10.0, 11.5],
            [50.0, 52.0, 51.0, 49.0, 53.0, 50.5, 51.5, 48.5, 52.5, 50.2],
            [120.0, 122.0, 118.0, 121.0, 119.5, 120.5, 123.0, 117.0, 121.5, 119.0],
            [400.0, 410.0, 405.0, 415.0, 408.0, 402.0, 412.0, 398.0, 407.0, 411.0],
        ]
        res = H4.run(g, AGE_CATEGORIES[:4])
        self.assertTrue(res["results"]["reject_null"])

    def test_h4_run_fails_to_reject_when_similar(self):
        g = [[60, 62], [61, 60], [59, 61], [60, 61]]
        res = H4.run(g, AGE_CATEGORIES[:4])
        self.assertFalse(res["results"]["reject_null"])

    def test_h4_run_contains_group_summaries(self):
        g = [[30, 35], [50, 55], [80, 85], [150, 160]]
        res = H4.run(g, AGE_CATEGORIES[:4])
        self.assertEqual(len(res["group_summaries"]), 4)

    def test_h4_run_contains_post_hoc(self):
        res = H4.run([[20, 22], [80, 85]], AGE_CATEGORIES[:2])
        self.assertEqual(len(res["post_hoc_comparisons"]), 1)

    def test_h4_run_contains_required_fields(self):
        res = H4.run([[40], [90]], AGE_CATEGORIES[:2])
        self.assertIn("hypothesis", res)

    def test_h4_reports_weighted_method(self):
        self.assertIn("Weighted", H4.STATISTICAL_METHOD)

    def test_h4_weights_change_the_statistic(self):
        """Visit counts must actually drive the test, not merely decorate the output."""
        g = [[10.0, 90.0], [11.0, 91.0]]
        w = [[5000, 1], [1, 5000]]
        unweighted = H4.run(g, AGE_CATEGORIES[:2])
        weighted = H4.run(g, AGE_CATEGORIES[:2], w)
        self.assertNotEqual(unweighted["results"]["h_statistic"],
                            weighted["results"]["h_statistic"])
        self.assertEqual(weighted["results"]["weighted_n"], 10002)

    def test_h4_reports_effect_size_and_df(self):
        res = H4.run([[20, 22], [80, 85]], AGE_CATEGORIES[:2])
        self.assertEqual(res["results"]["degrees_of_freedom"], 1)
        self.assertGreaterEqual(res["results"]["epsilon_squared"], 0.0)
        self.assertLessEqual(res["results"]["epsilon_squared"], 1.0)

    def test_age_category_order_matches_database_vocabulary(self):
        """The ordering constant must describe categories the database really stores."""
        self.assertEqual(H4.AGE_CATEGORY_ORDER, AGE_CATEGORIES)

        df = db_manager.read_sql("SELECT DISTINCT age_broad_category FROM age_sex")
        if not df.empty:
            stored = {str(c) for c in df["age_broad_category"].dropna()}
            self.assertTrue(
                stored.issubset(set(H4.AGE_CATEGORY_ORDER)),
                f"age_sex contains categories missing from AGE_CATEGORY_ORDER: "
                f"{stored - set(H4.AGE_CATEGORY_ORDER)}",
            )


if __name__ == "__main__":
    unittest.main()
