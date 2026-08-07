"""
Test Suite: Session-scoped isolation of user datasets.

Two people using the platform concurrently must not see each other's uploads. Isolation is
scoped by an opaque session id supplied by the browser.

This is isolation, NOT authentication — a session id is not a credential and can be forged
by anyone crafting the header. It reliably prevents users from stumbling into each other's
data; it does not defend against a determined caller. The tests below assert the former.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import tempfile
import unittest

from backend.database.database_manager import DatabaseManager
from backend.services.user_dataset_service import UserDatasetService

ALICE = "sess-alice-0001"
BOB = "sess-bob-0002"

ROWS_A = [{"fiscal_year": "2021-2022", "ed_visits": 100 + i} for i in range(5)]
ROWS_B = [{"fiscal_year": "2022-2023", "ed_visits": 900 + i} for i in range(5)]


class IsolationTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = DatabaseManager(os.path.join(self.tmp.name, "isolation.db"))

    def tearDown(self):
        try:
            self.tmp.cleanup()
        except (PermissionError, OSError):
            pass


class TestOwnerScopedListing(IsolationTestCase):
    def test_each_session_sees_only_its_own_datasets(self):
        UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        UserDatasetService.persist(ROWS_B, "Bob upload", owner_id=BOB, manager=self.db)

        alice = UserDatasetService.list_datasets(owner_id=ALICE, manager=self.db)
        bob = UserDatasetService.list_datasets(owner_id=BOB, manager=self.db)

        self.assertEqual([d["display_name"] for d in alice], ["Alice upload"])
        self.assertEqual([d["display_name"] for d in bob], ["Bob upload"])

    def test_omitting_the_owner_returns_everything(self):
        """Backward compatibility: an unscoped call still sees all rows."""
        UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        UserDatasetService.persist(ROWS_B, "Bob upload", owner_id=BOB, manager=self.db)
        self.assertEqual(len(UserDatasetService.list_datasets(manager=self.db)), 2)

    def test_unknown_session_sees_nothing(self):
        UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        self.assertEqual(UserDatasetService.list_datasets(owner_id="sess-nobody", manager=self.db), [])

    def test_legacy_rows_without_an_owner_are_not_leaked_to_a_session(self):
        """Rows persisted before scoping existed have owner_id NULL. A scoped caller must
        not inherit them, or the first user to arrive would adopt everyone's history."""
        UserDatasetService.persist(ROWS_A, "Legacy upload", manager=self.db)
        self.assertEqual(UserDatasetService.list_datasets(owner_id=ALICE, manager=self.db), [])


class TestOwnerScopedAccess(IsolationTestCase):
    def test_a_session_cannot_read_another_sessions_rows(self):
        entry = UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        self.assertIsNone(
            UserDatasetService.get_records(entry["dataset_id"], owner_id=BOB, manager=self.db)
        )

    def test_the_owning_session_can_read_its_own_rows(self):
        entry = UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        result = UserDatasetService.get_records(entry["dataset_id"], owner_id=ALICE, manager=self.db)
        self.assertEqual(result["returned_rows"], 5)

    def test_guessing_a_dataset_id_does_not_bypass_scoping(self):
        entry = UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        # Bob knows the id exactly and still cannot read it.
        self.assertIsNone(
            UserDatasetService.get_records(entry["dataset_id"], owner_id=BOB, manager=self.db)
        )

    def test_a_session_cannot_delete_another_sessions_dataset(self):
        entry = UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        self.assertFalse(
            UserDatasetService.delete_dataset(entry["dataset_id"], owner_id=BOB, manager=self.db)
        )
        # ...and the data survives the attempt
        self.assertIn(entry["table_name"], self.db.get_tables())

    def test_the_owning_session_can_delete_its_own_dataset(self):
        entry = UserDatasetService.persist(ROWS_A, "Alice upload", owner_id=ALICE, manager=self.db)
        self.assertTrue(
            UserDatasetService.delete_dataset(entry["dataset_id"], owner_id=ALICE, manager=self.db)
        )
        self.assertNotIn(entry["table_name"], self.db.get_tables())


class TestSchemaMigration(IsolationTestCase):
    def test_owner_column_is_added_to_a_pre_existing_registry(self):
        """An existing database predates the column. Adding it must not require a rebuild,
        because a rebuild would destroy every persisted upload."""
        self.db.execute_script(
            "CREATE TABLE user_datasets ("
            "  dataset_id TEXT PRIMARY KEY, table_name TEXT NOT NULL UNIQUE,"
            "  display_name TEXT NOT NULL, row_count INTEGER NOT NULL DEFAULT 0,"
            "  column_count INTEGER NOT NULL DEFAULT 0, quality_score REAL,"
            "  created_at TEXT NOT NULL)"
        )
        entry = UserDatasetService.persist(ROWS_A, "After migration", owner_id=ALICE, manager=self.db)
        self.assertEqual(entry["owner_id"], ALICE)

        columns = [r["name"] for r in self.db.execute_query("PRAGMA table_info(user_datasets)")]
        self.assertIn("owner_id", columns)

    def test_migration_preserves_existing_rows(self):
        UserDatasetService.persist(ROWS_A, "Legacy upload", manager=self.db)
        before = len(UserDatasetService.list_datasets(manager=self.db))
        UserDatasetService.persist(ROWS_B, "Scoped upload", owner_id=BOB, manager=self.db)
        self.assertEqual(len(UserDatasetService.list_datasets(manager=self.db)), before + 1)


class TestSeededCohortStillShared(IsolationTestCase):
    def test_scoping_does_not_touch_the_seeded_tables(self):
        """H1-H5 must stay identical for everyone — that is the point of the seeded store."""
        self.db.execute_script(
            "CREATE TABLE ed_visits (id INTEGER, ed_visits INTEGER);"
            "INSERT INTO ed_visits VALUES (1, 7296);"
        )
        UserDatasetService.persist(ROWS_A, "Alice", owner_id=ALICE, manager=self.db)
        UserDatasetService.persist(ROWS_B, "Bob", owner_id=BOB, manager=self.db)

        rows = self.db.execute_query("SELECT * FROM ed_visits")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["ed_visits"], 7296)


if __name__ == "__main__":
    unittest.main()
