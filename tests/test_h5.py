import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.hypothesis import H5
from backend.analytics.statistics.chi_square import chi_square_test, chi_square_summary

class TestChiSquare(unittest.TestCase):
    def test_chi_square_detects_independence(self):
        chi2, df, p = chi_square_test([[50, 50], [50, 50]])
        self.assertAlmostEqual(chi2, 0.0, places=4)

    def test_chi_square_detects_association(self):
        chi2, df, p = chi_square_test([[900, 100], [100, 900]])
        self.assertGreater(chi2, 9.0)

    def test_chi_square_empty_returns_default(self):
        chi2, df, p = chi_square_test([])
        self.assertEqual(chi2, 0.0)

    def test_chi_square_summary_structure(self):
        res = chi_square_summary([[500, 500], [400, 600]], ["Male", "Female"], ["Admitted", "Discharged"])
        self.assertIn("chi2_statistic", res)

class TestH5Module(unittest.TestCase):
    def test_h5_run_rejects_null_with_strong_association(self):
        res = H5.run([[900, 100], [100, 900]], ["Male", "Female"], ["Admitted", "Discharged"])
        self.assertTrue(res["results"]["reject_null"])

    def test_h5_run_fails_to_reject_with_no_association(self):
        res = H5.run([[500, 500], [500, 500]], ["Male", "Female"], ["Admitted", "Discharged"])
        self.assertFalse(res["results"]["reject_null"])

    def test_h5_run_empty_table_returns_error(self):
        res = H5.run([], [], [])
        self.assertIn("error", res)

    def test_h5_run_contains_required_fields(self):
        res = H5.run([[300, 700], [400, 600]], ["Male", "Female"], ["Admitted", "Discharged"])
        self.assertIn("hypothesis", res)

    def test_h5_run_assumption_check_flags_low_expected(self):
        res = H5.run([[1, 1], [1, 1]], ["Male", "Female"], ["Admitted", "Discharged"])
        self.assertFalse(res["assumption_checks"]["assumption_met"])

    def test_h5_contingency_table_preserved(self):
        obs = [[300, 700], [400, 600]]
        res = H5.run(obs, ["Male", "Female"], ["Admitted", "Discharged"])
        self.assertEqual(res["contingency_table"]["observed"], obs)

if __name__ == "__main__":
    unittest.main()
