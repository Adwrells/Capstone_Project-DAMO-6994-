"""
Test Suite: User dataset persistence.

Covers the Path A → SQLite write introduced so a web user's cleaned data can be read back
from the database. The isolation guarantee is the critical property: an upload must never
touch the six seeded analytical tables that H1–H5 depend on.

Every test runs against a throwaway database in a temp directory.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import tempfile
import unittest

from backend.database.database_manager import DatabaseManager
from backend.services.user_dataset_service import (
    REGISTRY_TABLE, TABLE_PREFIX, UserDatasetService,
    build_schema, infer_sql_type, sanitize_column,
)

SAMPLE = [
    {"fiscal_year": "2021-2022", "sex": "Female", "ed_visits": 1200, "los_hours": 3.5},
    {"fiscal_year": "2021-2022", "sex": "Male", "ed_visits": 980, "los_hours": 4.25},
    {"fiscal_year": "2022-2023", "sex": "Female", "ed_visits": 1310, "los_hours": 3.1},
]


class TempDBTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = DatabaseManager(os.path.join(self.tmp.name, "user_test.db"))

    def tearDown(self):
        try:
            self.tmp.cleanup()
        except (PermissionError, OSError):
            pass  # Windows may still hold the file; the temp dir is disposable either way


class TestColumnSanitisation(unittest.TestCase):
    def test_spaces_and_symbols_become_underscores(self):
        self.assertEqual(sanitize_column("Main Problem (ED)", 0), "Main_Problem__ED_")

    def test_leading_digit_is_prefixed(self):
        self.assertEqual(sanitize_column("2021 visits", 0), "col_2021_visits")

    def test_empty_name_falls_back_to_position(self):
        self.assertEqual(sanitize_column("", 3), "column_3")
        self.assertEqual(sanitize_column("   ", 5), "column_5")

    def test_sql_metacharacters_are_stripped(self):
        cleaned = sanitize_column('a"; DROP TABLE x --', 0)
        self.assertNotIn('"', cleaned)
        self.assertNotIn(";", cleaned)
        self.assertNotIn(" ", cleaned)

    def test_name_is_length_capped(self):
        self.assertLessEqual(len(sanitize_column("x" * 200, 0)), 64)


class TestTypeInference(unittest.TestCase):
    def test_integers(self):
        self.assertEqual(infer_sql_type([1, 2, 3]), "INTEGER")

    def test_floats(self):
        self.assertEqual(infer_sql_type([1.5, 2.0]), "REAL")

    def test_numeric_strings_are_real(self):
        self.assertEqual(infer_sql_type(["3.5", "4.25"]), "REAL")

    def test_text(self):
        self.assertEqual(infer_sql_type(["Female", "Male"]), "TEXT")

    def test_all_empty_is_text(self):
        self.assertEqual(infer_sql_type([None, "", None]), "TEXT")

    def test_booleans_are_text_not_integers(self):
        self.assertEqual(infer_sql_type([True, False]), "TEXT")


class TestSchemaBuilding(unittest.TestCase):
    def test_schema_covers_every_column(self):
        self.assertEqual(len(build_schema(SAMPLE)), 4)

    def test_empty_records_yield_empty_schema(self):
        self.assertEqual(build_schema([]), {})

    def test_colliding_sanitised_names_stay_unique(self):
        schema = build_schema([{"A/B": 1, "A-B": 2}])
        self.assertEqual(len(schema), 2)


class TestPersistence(TempDBTestCase):
    def test_persist_returns_registry_entry(self):
        entry = UserDatasetService.persist(SAMPLE, "My Upload", 92.5, manager=self.db)
        self.assertEqual(entry["row_count"], 3)
        self.assertEqual(entry["column_count"], 4)
        self.assertEqual(entry["display_name"], "My Upload")
        self.assertTrue(entry["table_name"].startswith(TABLE_PREFIX))

    def test_rows_are_readable_back(self):
        entry = UserDatasetService.persist(SAMPLE, manager=self.db)
        result = UserDatasetService.get_records(entry["dataset_id"], manager=self.db)
        self.assertEqual(result["returned_rows"], 3)
        self.assertEqual(result["data"][0]["fiscal_year"], "2021-2022")
        self.assertEqual(result["data"][1]["ed_visits"], 980)

    def test_each_upload_gets_its_own_table(self):
        a = UserDatasetService.persist(SAMPLE, "First", manager=self.db)
        b = UserDatasetService.persist(SAMPLE, "Second", manager=self.db)
        self.assertNotEqual(a["table_name"], b["table_name"])
        self.assertEqual(len(UserDatasetService.list_datasets(manager=self.db)), 2)

    def test_empty_records_are_rejected(self):
        with self.assertRaises(ValueError):
            UserDatasetService.persist([], manager=self.db)

    def test_unknown_dataset_returns_none(self):
        self.assertIsNone(UserDatasetService.get_records("nope", manager=self.db))

    def test_delete_removes_table_and_registry_row(self):
        entry = UserDatasetService.persist(SAMPLE, manager=self.db)
        self.assertTrue(UserDatasetService.delete_dataset(entry["dataset_id"], manager=self.db))
        self.assertNotIn(entry["table_name"], self.db.get_tables())
        self.assertEqual(UserDatasetService.list_datasets(manager=self.db), [])

    def test_delete_unknown_id_returns_false(self):
        self.assertFalse(UserDatasetService.delete_dataset("nope", manager=self.db))

    def test_empty_strings_are_stored_as_null(self):
        entry = UserDatasetService.persist([{"a": "", "b": "x"}], manager=self.db)
        row = UserDatasetService.get_records(entry["dataset_id"], manager=self.db)["data"][0]
        self.assertIsNone(row["a"])

    def test_row_limit_is_bounded(self):
        entry = UserDatasetService.persist(SAMPLE, manager=self.db)
        result = UserDatasetService.get_records(entry["dataset_id"], limit=1, manager=self.db)
        self.assertEqual(result["returned_rows"], 1)

    def test_malformed_limit_falls_back_to_default(self):
        entry = UserDatasetService.persist(SAMPLE, manager=self.db)
        result = UserDatasetService.get_records(entry["dataset_id"], limit="all", manager=self.db)
        self.assertEqual(result["returned_rows"], 3)


class TestSeededCohortIsolation(TempDBTestCase):
    """The guarantee that makes H1-H5 reproducible: uploads never touch the seeded tables."""

    SEEDED = ["ed_visits", "ctas_triage", "visit_disposition", "age_sex", "main_problems", "demographics"]

    def test_persisting_creates_no_seeded_table_names(self):
        UserDatasetService.persist(SAMPLE, manager=self.db)
        tables = self.db.get_tables()
        for name in self.SEEDED:
            self.assertNotIn(name, tables)

    def test_persisted_table_is_namespaced(self):
        entry = UserDatasetService.persist(SAMPLE, manager=self.db)
        self.assertTrue(entry["table_name"].startswith(TABLE_PREFIX))
        self.assertNotIn(entry["table_name"], self.SEEDED)

    def test_existing_seeded_table_is_untouched_by_an_upload(self):
        self.db.execute_script(
            "CREATE TABLE ed_visits (id INTEGER, ed_visits INTEGER);"
            "INSERT INTO ed_visits VALUES (1, 7296);"
        )
        UserDatasetService.persist(SAMPLE, manager=self.db)
        rows = self.db.execute_query("SELECT * FROM ed_visits")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["ed_visits"], 7296)

    def test_registry_is_not_declared_in_schema_sql(self):
        """schema.sql drops its tables; the registry must not be there or a rebuild
        would silently destroy every user upload."""
        from pathlib import Path
        schema = (Path(__file__).parent.parent / "backend" / "database" / "schema.sql").read_text(encoding="utf-8")
        self.assertNotIn(REGISTRY_TABLE, schema)


if __name__ == "__main__":
    unittest.main()
