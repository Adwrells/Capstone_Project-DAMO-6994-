import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.hypothesis import H3
from backend.analytics.statistics.linear_regression import linear_regression, regression_summary

class TestLinearRegression(unittest.TestCase):
    def test_linear_regression_known_values(self):
        res = linear_regression([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])
        self.assertAlmostEqual(res["slope"], 2.0, places=3)
        self.assertAlmostEqual(res["r_squared"], 1.0, places=3)

    def test_linear_regression_insufficient_data(self):
        res = linear_regression([1.0], [2.0])
        self.assertEqual(res["slope"], 0.0)

    def test_linear_regression_no_relationship(self):
        res = linear_regression([1, 2, 3, 4, 5], [5, 3, 4, 5, 3])
        self.assertLess(res["r_squared"], 0.5)

    def test_regression_summary_structure(self):
        res = regression_summary([1, 2, 3, 4, 5], [10, 20, 30, 40, 50], "X", "Y")
        self.assertIn("slope", res)

    def test_weighted_linear_regression(self):
        res = regression_summary([1, 2, 3, 4, 5], [2, 4, 6, 8, 10], "X", "Y", weights=[10, 20, 30, 40, 50])
        self.assertAlmostEqual(res["slope"], 2.0, places=3)
        self.assertAlmostEqual(res["r_squared"], 1.0, places=3)

class TestH3Module(unittest.TestCase):
    def test_h3_run_with_linear_relationship(self):
        res = H3.run([5.0, 4.0, 3.0, 2.0, 1.0, 5.0, 4.0, 3.0], [200.0, 160.0, 120.0, 80.0, 40.0, 210.0, 155.0, 115.0])
        self.assertEqual(res["hypothesis"], "H3")

    def test_h3_run_with_weights(self):
        res = H3.run(
            [5.0, 4.0, 3.0, 2.0, 1.0],
            [200.0, 160.0, 120.0, 80.0, 40.0],
            weights=[100.0, 200.0, 300.0, 200.0, 100.0]
        )
        self.assertEqual(res["hypothesis"], "H3")
        self.assertEqual(res["statistical_method"], "Weighted Least Squares Linear Regression")
        self.assertAlmostEqual(res["results"]["r_squared"], 1.0, places=3)

    def test_h3_run_insufficient_data_returns_error(self):
        res = H3.run([1.0, 2.0], [3.0, 4.0])
        self.assertIn("error", res)

    def test_h3_run_contains_required_fields(self):
        res = H3.run([5.0, 4.0, 3.0, 2.0, 1.0, 4.0], [180.0, 150.0, 120.0, 90.0, 60.0, 145.0])
        self.assertIn("hypothesis", res)

    def test_h3_run_r_squared_between_zero_and_one(self):
        res = H3.run([5.0, 4.0, 3.0, 2.0, 1.0, 4.0], [200.0, 160.0, 120.0, 80.0, 40.0, 155.0])
        r_sq = res["results"]["r_squared"]
        self.assertGreaterEqual(r_sq, 0.0)
        self.assertLessEqual(r_sq, 1.0)

if __name__ == "__main__":
    unittest.main()
