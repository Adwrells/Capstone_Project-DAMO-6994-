import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.dashboard.kpis import compute_er_kpis, compute_erbi, compute_problem_rank, compute_population_category
from backend.analytics.dashboard.insights import generate_kpi_insight, generate_hypothesis_summary

class TestERKPIs(unittest.TestCase):
    def test_compute_er_kpis_empty(self):
        res = compute_er_kpis([])
        self.assertEqual(res["total_visits"], 0)

    def test_compute_er_kpis_basic(self):
        res = compute_er_kpis([{"ed_visits": 1000, "admitted_visits": 200}])
        self.assertEqual(res["total_visits"], 1000)

    def test_compute_problem_rank(self):
        res = compute_problem_rank([{"problem": "A", "ed_visits": 100}, {"problem": "B", "ed_visits": 500}])
        self.assertEqual(res[0]["problem"], "B")

    def test_compute_population_category(self):
        self.assertEqual(compute_population_category("0-19"), "Pediatric & Youth")

class TestERBI(unittest.TestCase):
    def test_compute_erbi_empty(self):
        self.assertIn("error", compute_erbi([]))

    def test_compute_erbi_basic(self):
        res = compute_erbi([{"triage_level": "1", "age_broad_category": "Older Adult", "ctas_urgency_score": 5.0, "length_of_stay_hours": 8.0, "ed_visits": 100}])
        self.assertIn("overall_erbi_score", res)

class TestInsights(unittest.TestCase):
    def test_generate_kpi_insight(self):
        self.assertIn("50,000", generate_kpi_insight({"total_visits": 50000, "admission_rate_percent": 18.5}))

    def test_generate_hypothesis_summary(self):
        res = generate_hypothesis_summary([{"hypothesis": "H1", "results": {"reject_null": True, "p_value": 0.001}, "interpretation": "Sig"}])
        self.assertEqual(res[0]["hypothesis"], "H1")

if __name__ == "__main__":
    unittest.main()
