"""
Healthcare Analytics Platform - Test Suite: FastAPI Endpoints & API Handlers
"""

import unittest
import asyncio
from backend.main import root, health_check
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
from backend.api.insights import get_strategic_insights


class TestAPIEndpoints(unittest.TestCase):
    def test_root_health_direct(self):
        res = asyncio.run(root())
        self.assertEqual(res["status"], "healthy")
        self.assertEqual(res["version"], "1.0.0")

    def test_api_health_check_direct(self):
        res = asyncio.run(health_check())
        self.assertEqual(res["status"], "ok")

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

    def test_statistical_methods_direct(self):
        methods = asyncio.run(get_statistical_methods())
        self.assertTrue(methods["success"])
        self.assertIn("methods", methods)

    def test_statistics_dashboard_direct(self):
        dash = asyncio.run(get_statistics_dashboard())
        self.assertTrue(dash["success"])
        self.assertIn("dashboard", dash)

    def test_dashboard_summary_direct(self):
        summary = asyncio.run(get_dashboard_summary())
        self.assertTrue(summary["success"])
        self.assertIn("tables", summary)

    def test_strategic_insights_synthesis_direct(self):
        res = asyncio.run(get_strategic_insights())
        self.assertTrue(res["success"])
        self.assertEqual(len(res["keyInsights"]), 4)
        self.assertEqual(len(res["evidenceMatrix"]), 5)
        self.assertEqual(len(res["recommendations"]), 3)
        self.assertIn("roadmap", res)
        self.assertIn("decisionBoundaries", res)


if __name__ == "__main__":
    unittest.main()

