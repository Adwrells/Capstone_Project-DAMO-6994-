"""
Master Dashboard Test Suite
===========================
Verifies all 11 Master Dashboard API endpoints, KPI calculations,
Hypothesis H1–H5 analytical contracts, and ERBI resource burden computations.
"""

import unittest
import asyncio
from backend.api.dashboard import (
    get_dashboard_kpis,
    get_dashboard_trends,
    get_dashboard_ctas,
    get_dashboard_disposition,
    get_dashboard_regression,
    get_dashboard_demographics,
    get_dashboard_sex_disposition,
    get_dashboard_resource_burden,
    get_dashboard_main_problems,
    get_dashboard_hypotheses,
    get_dashboard_summary,
)


class TestMasterDashboardEndpoints(unittest.TestCase):
    def test_kpis_endpoint(self):
        data = asyncio.run(get_dashboard_kpis())
        self.assertTrue(data.get("success"))
        kpis = data.get("kpis", {})
        self.assertIn("total_ed_visits", kpis)
        self.assertIn("reported_median_los_hours", kpis)
        self.assertIn("admission_rate_percent", kpis)
        self.assertIn("overall_erbi_score", kpis)
        self.assertEqual(kpis.get("hypotheses_evaluated"), 5)

    def test_trends_endpoint(self):
        data = asyncio.run(get_dashboard_trends())
        self.assertTrue(data.get("success"))
        self.assertIn("series", data)
        self.assertGreater(len(data["series"]), 0)
        self.assertIn("mann_kendall", data)

    def test_ctas_h1_endpoint(self):
        data = asyncio.run(get_dashboard_ctas())
        self.assertTrue(data.get("success"))
        self.assertIn("group_summaries", data)
        self.assertEqual(data.get("decision"), "Reject H₀")

    def test_disposition_h2_endpoint(self):
        data = asyncio.run(get_dashboard_disposition())
        self.assertTrue(data.get("success"))
        self.assertIn("group_summaries", data)
        self.assertEqual(data.get("decision"), "Reject H₀")

    def test_regression_h3_endpoint(self):
        data = asyncio.run(get_dashboard_regression())
        self.assertTrue(data.get("success"))
        self.assertIn("regression", data)
        self.assertIn("scatter_points", data)
        self.assertEqual(data["regression"].get("decision"), "Reject H₀")

    def test_demographics_h4_endpoint(self):
        data = asyncio.run(get_dashboard_demographics())
        self.assertTrue(data.get("success"))
        self.assertIn("group_summaries", data)
        self.assertEqual(data.get("decision"), "Reject H₀")

    def test_sex_disposition_h5_endpoint(self):
        data = asyncio.run(get_dashboard_sex_disposition())
        self.assertTrue(data.get("success"))
        self.assertIn("results", data)
        self.assertIn("cramers_v", data)
        self.assertEqual(data["results"].get("decision"), "Reject H₀")

    def test_resource_burden_endpoint(self):
        data = asyncio.run(get_dashboard_resource_burden())
        self.assertTrue(data.get("success"))
        self.assertIn("triage_level_erbi", data)
        self.assertIn("overall_erbi_score", data)

    def test_main_problems_endpoint(self):
        data = asyncio.run(get_dashboard_main_problems())
        self.assertTrue(data.get("success"))
        self.assertIn("top_10_problems", data)
        self.assertGreater(len(data["top_10_problems"]), 0)

    def test_hypotheses_hub_endpoint(self):
        data = asyncio.run(get_dashboard_hypotheses())
        self.assertTrue(data.get("success"))
        hypotheses = data.get("hypotheses", {})
        self.assertEqual(len(hypotheses), 5)
        for h_id, h in hypotheses.items():
            self.assertEqual(h["decision"], "Reject H₀")

    def test_summary_endpoint(self):
        data = asyncio.run(get_dashboard_summary())
        self.assertTrue(data.get("success"))
        self.assertIn("tables", data)


if __name__ == "__main__":
    unittest.main()
