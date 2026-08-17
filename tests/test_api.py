"""
Healthcare Analytics Platform - Test Suite: FastAPI Endpoints & API Handlers
"""

import unittest
import asyncio

TEST_CLIENT_AVAILABLE = False
try:
    from fastapi.testclient import TestClient
    from backend.main import app
    TEST_CLIENT_AVAILABLE = True
except Exception:
    from backend.main import app

from backend.api.statistics import (
    get_hypothesis_h1,
    get_hypothesis_h2,
    get_hypothesis_h3,
    get_hypothesis_h4,
    get_hypothesis_h5,
    get_statistical_methods,
    get_statistics_dashboard,
)
from backend.api.dashboard import get_dashboard_kpis, get_dashboard_summary


class TestAPIEndpoints(unittest.TestCase):

    def setUp(self):
        if TEST_CLIENT_AVAILABLE:
            try:
                self.client = TestClient(app)
            except Exception:
                self.client = None
        else:
            self.client = None

    def test_root_health_direct(self):
        if self.client is not None:
            response = self.client.get("/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["status"], "healthy")

    def test_dashboard_kpis_direct(self):
        res = asyncio.run(get_dashboard_kpis())
        self.assertTrue(res["success"])
        self.assertIn("kpis", res)

    def test_statistics_h1_to_h5_direct(self):
        h1_res = asyncio.run(get_hypothesis_h1())
        self.assertTrue(h1_res["success"])

        h2_res = asyncio.run(get_hypothesis_h2())
        self.assertTrue(h2_res["success"])

        h3_res = asyncio.run(get_hypothesis_h3())
        self.assertTrue(h3_res["success"])

        h4_res = asyncio.run(get_hypothesis_h4())
        self.assertTrue(h4_res["success"])

        h5_res = asyncio.run(get_hypothesis_h5())
        self.assertTrue(h5_res["success"])

        dash_res = asyncio.run(get_statistics_dashboard())
        self.assertTrue(dash_res["success"])

    def test_hypothesis_endpoints_report_weighted_tests(self):
        """The API must advertise the weighting it actually performs."""
        h1 = asyncio.run(get_hypothesis_h1())
        h2 = asyncio.run(get_hypothesis_h2())
        h4 = asyncio.run(get_hypothesis_h4())

        for res in (h1, h2, h4):
            self.assertIn("Weighted", res["test_name"])
            self.assertIn("weighted_n", res)
            self.assertGreater(res["weighted_n"], 0)

        for res in (h1, h4):
            self.assertIn("epsilon_squared", res)
            self.assertIn("degrees_of_freedom", res)
            self.assertLessEqual(res["tie_correction"], 1.0)

        self.assertIn("rank_biserial", h2)

    def test_statistics_dashboard_carries_effect_sizes(self):
        dash = asyncio.run(get_statistics_dashboard())
        summary = dash["summary_dashboard"]
        self.assertEqual(dash["alpha"], 0.05)
        for key, metric in (("H1_Triage_Difference", "epsilon_squared"),
                            ("H2_Admission_Difference", "rank_biserial"),
                            ("H4_Age_Group_Difference", "epsilon_squared")):
            self.assertEqual(summary[key]["effect_size_metric"], metric)
            self.assertIsNotNone(summary[key]["effect_size"])
            self.assertGreater(summary[key]["weighted_n"], 0)

    def test_methods_endpoint_matches_engine(self):
        """/methods must be derived from the modules, not a hand-maintained list."""
        from backend.analytics.hypothesis_testing import TEST_KRUSKAL, TEST_MANN_WHITNEY

        res = asyncio.run(get_statistical_methods())
        self.assertTrue(res["success"])
        self.assertTrue(res["weighting"]["applied"])
        self.assertEqual(res["weighting"]["weight_column"], "ed_visits")
        self.assertEqual(res["methods"]["H1"]["test"], TEST_KRUSKAL)
        self.assertEqual(res["methods"]["H4"]["test"], TEST_KRUSKAL)
        self.assertEqual(res["methods"]["H2"]["test"], TEST_MANN_WHITNEY)
        self.assertEqual(set(res["methods"]), {"H1", "H2", "H3", "H4", "H5"})


if __name__ == "__main__":
    unittest.main()
