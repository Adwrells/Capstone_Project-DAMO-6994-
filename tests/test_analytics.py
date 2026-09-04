"""
Healthcare Analytics Platform - Test Suite: Analytics & Statistics Engine
"""

import unittest
from backend.analytics.descriptive import calculate_mean, calculate_std, calculate_five_number_summary
from backend.analytics.regression import linear_regression, run_h3_regression
from backend.analytics.hypothesis_testing import run_h1_test, run_h2_test, run_h4_test, run_h5_test
from backend.analytics.trend_analysis import mann_kendall_test, run_ed_visits_trend_analysis
from backend.analytics.forecasting import exponential_smoothing_forecast, run_ed_visits_forecasting
from backend.analytics.erbi import compute_erbi_metrics


class TestAnalyticsEngine(unittest.TestCase):

    def test_descriptive_stats(self):
        data = [10.0, 20.0, 30.0, 40.0, 50.0]
        self.assertEqual(calculate_mean(data), 30.0)
        summary = calculate_five_number_summary(data)
        self.assertEqual(summary["min"], 10.0)
        self.assertEqual(summary["max"], 50.0)
        self.assertEqual(summary["median"], 30.0)

    def test_linear_regression(self):
        x = [1.0, 2.0, 3.0, 4.0, 5.0]
        y = [2.0, 4.0, 6.0, 8.0, 10.0]
        res = linear_regression(x, y)
        self.assertAlmostEqual(res["slope"], 2.0, places=2)
        self.assertAlmostEqual(res["r_squared"], 1.0, places=2)

    def test_mann_kendall_test(self):
        data = [10, 15, 20, 25, 30, 35, 40]
        res = mann_kendall_test(data)
        self.assertEqual(res["trend"], "increasing")
        self.assertTrue(res["reject_null"])

    def test_exponential_smoothing(self):
        data = [100.0, 105.0, 110.0, 115.0, 120.0]
        res = exponential_smoothing_forecast(data, alpha=0.3, horizon=3)
        self.assertEqual(len(res["point_forecasts"]), 3)
        self.assertEqual(len(res["confidence_intervals"]), 3)

    def test_sqlite_analytics_integration(self):
        h1 = run_h1_test()
        self.assertIn("h_statistic", h1)
        h2 = run_h2_test()
        self.assertIn("u_statistic", h2)
        h3 = run_h3_regression()
        self.assertIn("slope", h3)
        h4 = run_h4_test()
        self.assertIn("h_statistic", h4)
        h5 = run_h5_test()
        self.assertIn("results", h5)
        self.assertIn("chi2_statistic", h5["results"])
        erbi = compute_erbi_metrics()
        self.assertIn("overall_erbi_score", erbi)


if __name__ == "__main__":
    unittest.main()
