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

    def test_h2_reports_weighted_method(self):
        self.assertIn("Weighted", H2.STATISTICAL_METHOD)

    def test_h2_weights_change_the_statistic(self):
        """Visit counts must actually drive the test, not merely decorate the output.

        Asserted on the p-value rather than U: for a symmetric fixture U can coincide
        between the weighted and unweighted runs while the inference differs entirely,
        because U is compared against a null whose spread depends on the weighted n.
        """
        admitted, discharged = [10.0, 90.0], [11.0, 91.0]
        unweighted = H2.run(admitted, discharged)
        weighted = H2.run(admitted, discharged, [5000, 1], [1, 5000])

        self.assertEqual(unweighted["results"]["weighted_n"], 4)
        self.assertEqual(weighted["results"]["weighted_n"], 10002)
        # Four observations cannot reach significance; ten thousand visits can.
        self.assertFalse(unweighted["results"]["reject_null"])
        self.assertTrue(weighted["results"]["reject_null"])
        self.assertLess(weighted["results"]["p_value"], unweighted["results"]["p_value"])

    def test_h2_reports_effect_size(self):
        res = H2.run([200.0, 250.0, 220.0], [40.0, 35.0, 45.0])
        rb = res["results"]["rank_biserial"]
        self.assertGreaterEqual(rb, -1.0)
        self.assertLessEqual(rb, 1.0)
        self.assertIn("z_score", res["results"])

    def test_h2_weighted_summaries_report_visit_counts(self):
        res = H2.run([150.0, 180.0], [50.0, 55.0], [100, 300], [200, 200])
        admitted, discharged = res["group_summaries"]
        self.assertEqual(admitted["weighted_n"], 400)
        self.assertEqual(discharged["weighted_n"], 400)
        # Weighted mean must lean toward the heavier row (180 weighted 300 of 400).
        self.assertAlmostEqual(admitted["mean_los"], 172.5, places=2)

if __name__ == "__main__":
    unittest.main()
