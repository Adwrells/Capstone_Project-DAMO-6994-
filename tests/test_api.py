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


if __name__ == "__main__":
    unittest.main()
