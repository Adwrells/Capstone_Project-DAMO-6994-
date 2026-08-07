"""
Test Suite: Cleaned-dataset loader column contract.

Guards the mapping between analyst-facing column names emitted by the cleaning notebooks
and the database-facing names declared in schema.sql. A silent drift here loads NULLs into
analytic columns without raising, so these assertions are the contract.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
import pandas as pd

from backend.database.load_csv import (
    COLUMN_MAP, DROP_COLUMNS, SOURCES, align_to_table, map_columns,
)


class TestColumnMapping(unittest.TestCase):
    def test_renames_analyst_columns_to_schema_names(self):
        df = pd.DataFrame({"median_los_minutes": [120.0], "median_los_hours": [2.0]})
        out = map_columns(df)
        self.assertIn("median_length_of_stay_min", out.columns)
        self.assertIn("length_of_stay_hours", out.columns)

    def test_population_category_becomes_age_broad_category(self):
        out = map_columns(pd.DataFrame({"population_category": ["Older Adult"]}))
        self.assertIn("age_broad_category", out.columns)

    def test_admission_flag_becomes_is_admitted(self):
        out = map_columns(pd.DataFrame({"admission_flag": [1]}))
        self.assertIn("is_admitted", out.columns)

    def test_analyst_only_columns_are_dropped(self):
        df = pd.DataFrame({"erbi": [1.5], "admission_status": ["Admitted"], "ed_visits": [10]})
        out = map_columns(df)
        self.assertNotIn("erbi", out.columns)
        self.assertNotIn("admission_status", out.columns)
        self.assertIn("ed_visits", out.columns)

    def test_unmapped_columns_pass_through_unchanged(self):
        out = map_columns(pd.DataFrame({"fiscal_year": ["2021-2022"], "sex": ["All"]}))
        self.assertIn("fiscal_year", out.columns)
        self.assertIn("sex", out.columns)

    def test_values_survive_the_rename(self):
        out = map_columns(pd.DataFrame({"median_los_minutes": [342.0]}))
        self.assertEqual(out["median_length_of_stay_min"].iloc[0], 342.0)

    def test_duplicate_columns_after_rename_are_collapsed(self):
        # Demographics carries population_category twice (pandas suffixes the second)
        df = pd.DataFrame({"population_category": ["Adult"], "age_broad_category": ["Adult"]})
        out = map_columns(df)
        self.assertEqual(list(out.columns).count("age_broad_category"), 1)


class TestAlignToTable(unittest.TestCase):
    def test_keeps_only_declared_columns(self):
        df = pd.DataFrame({"fiscal_year": ["2021"], "not_in_table": [1], "sex": ["All"]})
        out = align_to_table(df, ["fiscal_year", "sex"])
        self.assertEqual(list(out.columns), ["fiscal_year", "sex"])

    def test_preserves_table_column_order(self):
        df = pd.DataFrame({"sex": ["All"], "fiscal_year": ["2021"]})
        out = align_to_table(df, ["fiscal_year", "sex"])
        self.assertEqual(list(out.columns), ["fiscal_year", "sex"])

    def test_missing_columns_are_tolerated(self):
        df = pd.DataFrame({"fiscal_year": ["2021"]})
        out = align_to_table(df, ["fiscal_year", "sex", "ed_visits"])
        self.assertEqual(list(out.columns), ["fiscal_year"])

    def test_empty_frame_returns_empty_selection(self):
        out = align_to_table(pd.DataFrame({"a": []}), ["b"])
        self.assertEqual(len(out.columns), 0)


class TestLoaderConfiguration(unittest.TestCase):
    def test_all_six_analytical_tables_have_a_source(self):
        self.assertEqual(
            set(SOURCES),
            {"ed_visits", "ctas_triage", "visit_disposition", "age_sex", "main_problems", "demographics"},
        )

    def test_age_sex_is_sourced_from_the_workbook(self):
        # Age_Sex.csv does not exist on disk; only the master workbook carries this dataset.
        self.assertEqual(SOURCES["age_sex"][0], "Age_Sex")

    def test_column_map_targets_are_distinct(self):
        targets = list(COLUMN_MAP.values())
        self.assertEqual(len(targets), len(set(targets)))

    def test_dropped_columns_are_not_also_mapped(self):
        self.assertEqual(set(COLUMN_MAP) & DROP_COLUMNS, set())


if __name__ == "__main__":
    unittest.main()
