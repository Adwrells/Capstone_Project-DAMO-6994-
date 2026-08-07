import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.hypothesis import H1
from backend.analytics.statistics.kruskal import kruskal_wallis, dunn_post_hoc, mann_whitney_u

class TestKruskalWallis(unittest.TestCase):
    def test_kruskal_wallis_detects_difference(self):
        g1 = [10.0, 11.0, 10.5, 9.5, 10.2, 10.8, 11.2, 9.8, 10.0, 11.5]
        g2 = [200.0, 210.0, 205.0, 215.0, 208.0, 202.0, 212.0, 198.0, 207.0, 211.0]
        h, p = kruskal_wallis(g1, g2)
        self.assertGreater(h, 0)
        self.assertLess(p, 0.05)

    def test_kruskal_wallis_insufficient_data(self):
        h, p = kruskal_wallis([1.0], [2.0])
        self.assertEqual(p, 1.0)

    def test_kruskal_wallis_no_difference(self):
        h, p = kruskal_wallis([10.0, 10.1], [10.0, 10.1])
        self.assertGreater(p, 0.05)

class TestMannWhitneyU(unittest.TestCase):
    def test_mann_whitney_u_significant(self):
        u, p = mann_whitney_u([100, 110, 120, 130, 140], [20, 25, 22, 21, 23])
        self.assertLess(p, 0.05)

    def test_mann_whitney_u_empty_returns_default(self):
        u, p = mann_whitney_u([], [1, 2])
        self.assertEqual(p, 1.0)

class TestDunnPostHoc(unittest.TestCase):
    def test_dunn_post_hoc_returns_pairs(self):
        res = dunn_post_hoc([[10, 11], [50, 55], [30, 32]], ["L1", "L2", "L3"])
        self.assertEqual(len(res), 3)

class TestH1Module(unittest.TestCase):
    def test_h1_run_rejects_null(self):
        res = H1.run([[10.0, 11.0, 10.5, 9.5, 10.2], [200.0, 210.0, 205.0, 215.0, 208.0]], ["L1", "L5"])
        self.assertTrue(res["results"]["reject_null"])

    def test_h1_run_contains_required_fields(self):
        res = H1.run([[60, 65], [45, 42]], ["L2", "L4"])
        for f in ["hypothesis", "research_question", "null_hypothesis", "alternative_hypothesis", "statistical_method", "results"]:
            self.assertIn(f, res)

if __name__ == "__main__":
    unittest.main()
