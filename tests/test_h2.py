import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.hypothesis import H2

class TestH2Module(unittest.TestCase):
    def test_h2_run_rejects_null_when_significant(self):
        res = H2.run([200.0, 250.0, 220.0, 300.0, 280.0], [40.0, 35.0, 45.0, 38.0, 42.0])
        self.assertTrue(res["results"]["reject_null"])

    def test_h2_run_fails_to_reject_when_similar(self):
        res = H2.run([60.0, 62.0], [60.5, 61.5])
        self.assertFalse(res["results"]["reject_null"])

    def test_h2_run_contains_group_summaries(self):
        res = H2.run([150.0, 180.0], [50.0, 55.0])
        self.assertEqual(len(res["group_summaries"]), 2)

    def test_h2_run_contains_required_fields(self):
        res = H2.run([100.0], [40.0])
        self.assertIn("hypothesis", res)

    def test_h2_u_statistic_is_non_negative(self):
        res = H2.run([80.0, 90.0], [30.0, 35.0])
        self.assertGreaterEqual(res["results"]["u_statistic"], 0.0)

if __name__ == "__main__":
    unittest.main()
