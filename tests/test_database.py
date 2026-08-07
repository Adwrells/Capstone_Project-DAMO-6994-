"""
Healthcare Analytics Platform - Test Suite: Database Manager
"""

import unittest
import os
import tempfile
from backend.database.database_manager import DatabaseManager

class TestDatabaseManager(unittest.TestCase):

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        db_path = os.path.join(self.tmp_dir.name, "test_healthcare.db")
        self.db = DatabaseManager(db_path)
        self.db.execute_script("CREATE TABLE test_tbl (id INT, val TEXT);")

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_insert_and_select(self):
        affected = self.db.execute_command("INSERT INTO test_tbl VALUES (1, 'sample');")
        self.assertEqual(affected, 1)

        rows = self.db.execute_query("SELECT * FROM test_tbl;")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["val"], "sample")

if __name__ == "__main__":
    unittest.main()
