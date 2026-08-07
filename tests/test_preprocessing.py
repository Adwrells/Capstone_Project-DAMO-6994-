import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from backend.analytics.preprocessing.cleaning import (
    remove_duplicates, clean_missing_values, normalize_column_names, add_population_category, add_los_columns,
)
from backend.analytics.preprocessing.feature_engineering import (
    extract_fiscal_year, encode_sex_category, encode_admission_flag, add_admission_status,
)
from backend.analytics.preprocessing.validation import (
    validate_schema, calculate_null_ratios, run_health_check,
)

class TestCleaning(unittest.TestCase):
    def test_remove_duplicates(self):
        records = [{"a": 1, "b": 2}, {"a": 1, "b": 2}, {"a": 3, "b": 4}]
        self.assertEqual(len(remove_duplicates(records)), 2)

    def test_clean_missing_values_replaces_null_strings(self):
        records = [{"col": "null"}, {"col": "none"}, {"col": "NaN"}, {"col": "valid"}]
        res = clean_missing_values(records, fill_value="N/A")
        self.assertEqual(res[0]["col"], "N/A")
        self.assertEqual(res[3]["col"], "valid")

    def test_normalize_column_names(self):
        res = normalize_column_names([{"First Name": "A", "Last-Name": "B"}])
        self.assertIn("first_name", res[0])
        self.assertIn("last_name", res[0])

    def test_add_population_category(self):
        records = [{"age_group": "0-19"}, {"age_group": "20-44"}, {"age_group": "45-64"}, {"age_group": "65+"}, {"age_group": "unknown"}]
        res = add_population_category(records)
        self.assertEqual(res[0]["population_category"], "Pediatric & Youth")
        self.assertEqual(res[1]["population_category"], "Young Adult")
        self.assertEqual(res[2]["population_category"], "Middle Adult")
        self.assertEqual(res[3]["population_category"], "Older Adult")
        self.assertEqual(res[4]["population_category"], "Unknown")

    def test_add_los_columns(self):
        res = add_los_columns([{"median_length_of_stay_min": 120.0}])
        self.assertEqual(res[0]["median_los_minutes"], 120.0)
        self.assertAlmostEqual(res[0]["median_los_hours"], 2.0)

class TestFeatureEngineering(unittest.TestCase):
    def test_extract_fiscal_year(self):
        self.assertEqual(extract_fiscal_year("2015-2016"), "2015")
        self.assertEqual(extract_fiscal_year(""), "Unknown")

    def test_encode_sex_category(self):
        self.assertEqual(encode_sex_category("M"), "Male")
        self.assertEqual(encode_sex_category("female"), "Female")
        self.assertEqual(encode_sex_category("x"), "Other/Unknown")

    def test_encode_admission_flag(self):
        self.assertEqual(encode_admission_flag("Admitted"), 1)
        self.assertEqual(encode_admission_flag("Discharged"), 0)

    def test_add_admission_status(self):
        res = add_admission_status([{"visit_disposition": "Admitted"}, {"visit_disposition": "Discharged"}])
        self.assertEqual(res[0]["admission_status"], "Admitted")
        self.assertEqual(res[1]["admission_status"], "Discharged")

class TestValidation(unittest.TestCase):
    def test_validate_schema_valid(self):
        self.assertTrue(validate_schema([{"a": 1, "b": 2}], ["a", "b"])["valid"])

    def test_validate_schema_missing(self):
        self.assertFalse(validate_schema([{"a": 1}], ["a", "b"])["valid"])

    def test_calculate_null_ratios(self):
        res = calculate_null_ratios([{"a": 1, "b": None}, {"a": 2, "b": None}])
        self.assertEqual(res["b"], 100.0)

    def test_health_check_returns_score(self):
        res = run_health_check([{"col_a": 1, "col_b": "v"}], ["col_a", "col_b"])
        self.assertIn("health_score", res)

if __name__ == "__main__":
    unittest.main()
