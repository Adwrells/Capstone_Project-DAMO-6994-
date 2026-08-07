import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.hypothesis import H4

class TestH4Module(unittest.TestCase):
    def test_h4_run_rejects_null_when_significant(self):
        g = [
            [10.0, 11.0, 10.5, 9.5, 10.2, 10.8, 11.2, 9.8, 10.0, 11.5],
            [50.0, 52.0, 51.0, 49.0, 53.0, 50.5, 51.5, 48.5, 52.5, 50.2],
            [120.0, 122.0, 118.0, 121.0, 119.5, 120.5, 123.0, 117.0, 121.5, 119.0],
            [400.0, 410.0, 405.0, 415.0, 408.0, 402.0, 412.0, 398.0, 407.0, 411.0],
        ]
        names = ["Pediatric & Youth", "Young Adult", "Middle Adult", "Older Adult"]
        res = H4.run(g, names)
        self.assertTrue(res["results"]["reject_null"])

    def test_h4_run_fails_to_reject_when_similar(self):
        g = [[60, 62], [61, 60], [59, 61], [60, 61]]
        names = ["Pediatric & Youth", "Young Adult", "Middle Adult", "Older Adult"]
        res = H4.run(g, names)
        self.assertFalse(res["results"]["reject_null"])

    def test_h4_run_contains_group_summaries(self):
        g = [[30, 35], [50, 55], [80, 85], [150, 160]]
        names = ["Pediatric & Youth", "Young Adult", "Middle Adult", "Older Adult"]
        res = H4.run(g, names)
        self.assertEqual(len(res["group_summaries"]), 4)

    def test_h4_run_contains_post_hoc(self):
        res = H4.run([[20, 22], [80, 85]], ["Young Adult", "Older Adult"])
        self.assertEqual(len(res["post_hoc_comparisons"]), 1)

    def test_h4_run_contains_required_fields(self):
        res = H4.run([[40], [90]], ["Young Adult", "Older Adult"])
        self.assertIn("hypothesis", res)

    def test_h4_age_category_order(self):
        self.assertEqual(len(H4.AGE_CATEGORY_ORDER), 4)

if __name__ == "__main__":
    unittest.main()
