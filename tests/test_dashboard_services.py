"""
Test Suite: Dashboard, Insights and Dataset service layers.

These exercise logic that used to live as raw SQL inside backend/api/ routers (C2 in
architecture.md §4C). Because each service takes an injectable manager, every test here
runs against a stub — no SQLite file, no seeded data. That testability is the whole reason
the queries moved out of the routers.
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
import pandas as pd

from backend.services.dashboard_service import DashboardService
from backend.services.dataset_service import DatasetService
from backend.services.insights_service import (
    InsightsService, detect_outlier_recommendations, detect_volume_recommendations,
)


class FakeDB:
    """Minimal DatabaseManager stand-in. Matches queries by substring."""

    def __init__(self, tables=None, responses=None, frames=None):
        self._tables = tables if tables is not None else []
        self._responses = responses or {}
        self._frames = frames or {}
        self.queries = []

    def get_tables(self):
        return list(self._tables)

    def execute_query(self, query, params=()):
        self.queries.append(query)
        for fragment, rows in self._responses.items():
            if fragment in query:
                return rows
        return []

    def read_sql(self, query, params=()):
        self.queries.append(query)
        for fragment, frame in self._frames.items():
            if fragment in query:
                return frame
        return pd.DataFrame()


KPI_RESPONSES = {
    "SUM(ed_visits) as total FROM ed_visits": [{"total": 15000}],
    "MIN(fiscal_year)": [{"min_fy": "2018-2019", "max_fy": "2021-2022"}],
    "main_problem, SUM(ed_visits)": [{"main_problem": "Abdominal pain", "total": 9000}],
    "AVG(median_length_of_stay_min)": [{"avg_los": 187.44}],
    "COUNT(*) as cnt FROM ed_visits": [{"cnt": 7296}],
}


class TestDashboardServiceKPIs(unittest.TestCase):
    def setUp(self):
        self.db = FakeDB(tables=["ed_visits", "main_problems"], responses=KPI_RESPONSES)

    def test_totals_come_from_the_database(self):
        kpis = DashboardService.get_kpis(manager=self.db)
        self.assertEqual(kpis["total_ed_visits"], 15000)
        self.assertEqual(kpis["total_records_analyzed"], 7296)

    def test_year_range_is_formatted_from_min_and_max(self):
        kpis = DashboardService.get_kpis(manager=self.db)
        self.assertEqual(kpis["year_range"], "2018-2019 to 2021-2022")

    def test_top_condition_is_reported(self):
        self.assertEqual(DashboardService.get_kpis(manager=self.db)["top_condition"], "Abdominal pain")

    def test_average_los_is_rounded_and_converted_to_hours(self):
        kpis = DashboardService.get_kpis(manager=self.db)
        self.assertEqual(kpis["avg_median_length_of_stay_min"], 187.4)
        self.assertEqual(kpis["avg_median_length_of_stay_hours"], round(187.4 / 60.0, 2))

    def test_table_count_reflects_the_database(self):
        self.assertEqual(DashboardService.get_kpis(manager=self.db)["tables_in_sqlite"], 2)

    def test_empty_database_yields_zeroed_kpis_not_a_crash(self):
        kpis = DashboardService.get_kpis(manager=FakeDB(tables=[], responses={}))
        self.assertEqual(kpis["total_ed_visits"], 0)
        self.assertEqual(kpis["avg_median_length_of_stay_min"], 0.0)
        self.assertEqual(kpis["top_condition"], "N/A")

    def test_null_aggregates_fall_back_to_defaults(self):
        # SUM/AVG over an empty table return a row containing NULL, not an empty result.
        db = FakeDB(
            tables=["ed_visits"],
            responses={
                "SUM(ed_visits) as total FROM ed_visits": [{"total": None}],
                "AVG(median_length_of_stay_min)": [{"avg_los": None}],
                "MIN(fiscal_year)": [{"min_fy": None, "max_fy": None}],
            },
        )
        kpis = DashboardService.get_kpis(manager=db)
        self.assertEqual(kpis["total_ed_visits"], 0)
        self.assertEqual(kpis["avg_median_length_of_stay_min"], 0.0)
        self.assertEqual(kpis["year_range"], "2003-2004 to 2021-2022")

    def test_summary_returns_metadata_rows(self):
        db = FakeDB(responses={"FROM metadata": [{"table_name": "ed_visits", "row_count": 7296}]})
        self.assertEqual(DashboardService.get_summary(manager=db)[0]["row_count"], 7296)


class TestOutlierRecommendations(unittest.TestCase):
    def test_column_with_extreme_values_is_flagged(self):
        df = pd.DataFrame({"length_of_stay_hours": [2.0] * 20 + [500.0, 600.0]})
        found = detect_outlier_recommendations(df, "ctas_triage")
        self.assertTrue(found)
        self.assertEqual(found[0]["table"], "ctas_triage")

    def test_uniform_column_produces_no_recommendation(self):
        df = pd.DataFrame({"length_of_stay_hours": [2.0] * 40})
        self.assertEqual(detect_outlier_recommendations(df, "ctas_triage"), [])

    def test_identifier_columns_are_not_profiled(self):
        df = pd.DataFrame({"id": list(range(20)) + [99999], "fiscal_year_start": [2021] * 21})
        self.assertEqual(detect_outlier_recommendations(df, "ed_visits"), [])

    def test_too_few_rows_for_quartiles_is_skipped(self):
        self.assertEqual(detect_outlier_recommendations(pd.DataFrame({"los": [1.0, 90.0]}), "t"), [])

    def test_empty_frame_returns_no_recommendations(self):
        self.assertEqual(detect_outlier_recommendations(pd.DataFrame(), "t"), [])

    def test_severe_outlier_share_is_high_priority(self):
        df = pd.DataFrame({"los": [2.0] * 10 + [900.0] * 3})
        found = detect_outlier_recommendations(df, "t")
        self.assertEqual(found[0]["priority"], "HIGH")


class TestVolumeRecommendations(unittest.TestCase):
    def test_highest_volume_triage_level_is_reported(self):
        df = pd.DataFrame({
            "triage_level": ["CTAS I", "CTAS II", "CTAS II"],
            "ed_visits": [100, 900, 800],
        })
        found = detect_volume_recommendations(df, "ctas_triage")
        self.assertIn("CTAS II", found[0]["title"])

    def test_missing_required_columns_yields_nothing(self):
        self.assertEqual(detect_volume_recommendations(pd.DataFrame({"ed_visits": [1]}), "t"), [])

    def test_empty_frame_yields_nothing(self):
        self.assertEqual(detect_volume_recommendations(pd.DataFrame(), "t"), [])


class TestInsightsService(unittest.TestCase):
    def test_provenance_tables_are_excluded_from_profiling(self):
        db = FakeDB(tables=["metadata", "_ingestion_meta"])
        result = InsightsService.get_recommendations(manager=db)
        self.assertEqual(result["recommendations"], [])
        self.assertNotIn('FROM "metadata"', "".join(db.queries))

    def test_recommendations_are_capped(self):
        wide = pd.DataFrame({f"col_{i}": [1.0] * 20 + [900.0, 950.0] for i in range(15)})
        db = FakeDB(tables=["ctas_triage"], frames={"ctas_triage": wide})
        result = InsightsService.get_recommendations(manager=db)
        self.assertLessEqual(len(result["recommendations"]), 10)
        self.assertGreater(result["total_recommendations"], 10)

    def test_summary_reports_row_count_per_table(self):
        db = FakeDB(tables=["ed_visits"], responses={"COUNT(*)": [{"cnt": 7296}]})
        self.assertEqual(InsightsService.get_summary(manager=db), [{"table_name": "ed_visits", "row_count": 7296}])


class TestDatasetService(unittest.TestCase):
    def test_lists_available_tables(self):
        db = FakeDB(tables=["ed_visits", "age_sex"])
        self.assertEqual(DatasetService.list_datasets(manager=db), ["ed_visits", "age_sex"])

    def test_unknown_table_returns_none(self):
        db = FakeDB(tables=["ed_visits"])
        self.assertIsNone(DatasetService.get_records("does_not_exist", manager=db))

    def test_unknown_table_is_never_queried(self):
        db = FakeDB(tables=["ed_visits"])
        DatasetService.get_records("sqlite_master; DROP TABLE ed_visits", manager=db)
        self.assertEqual(db.queries, [])

    def test_known_table_returns_rows(self):
        db = FakeDB(tables=["ed_visits"], responses={"ed_visits": [{"id": 1}, {"id": 2}]})
        result = DatasetService.get_records("ed_visits", manager=db)
        self.assertEqual(result["row_count"], 2)
        self.assertEqual(result["dataset_name"], "ed_visits")

    def test_malformed_limit_falls_back_to_default_without_raising(self):
        db = FakeDB(tables=["ed_visits"], responses={"ed_visits": []})
        DatasetService.get_records("ed_visits", limit="5; DROP TABLE ed_visits", manager=db)
        self.assertNotIn("DROP", db.queries[0])
        self.assertIn("LIMIT 1000", db.queries[0])

    def test_limit_is_clamped_to_the_maximum(self):
        db = FakeDB(tables=["ed_visits"], responses={"ed_visits": []})
        DatasetService.get_records("ed_visits", limit=999999, manager=db)
        self.assertIn("LIMIT 10000", db.queries[0])

    def test_non_positive_limit_falls_back_to_default(self):
        db = FakeDB(tables=["ed_visits"], responses={"ed_visits": []})
        DatasetService.get_records("ed_visits", limit=0, manager=db)
        self.assertIn("LIMIT 1000", db.queries[0])


class TestTableNameAllowListing(unittest.TestCase):
    """Table names cannot be bound as SQL parameters, so every path that interpolates one
    must validate it against the live table list first. bandit flags these as B608; the
    allow-list is what makes them false positives. Remove it and they become real."""

    def test_dataset_service_rejects_unlisted_identifier(self):
        db = FakeDB(tables=["ed_visits"])
        injected = 'ed_visits" UNION SELECT * FROM sqlite_master --'
        self.assertIsNone(DatasetService.get_records(injected, manager=db))
        self.assertEqual(db.queries, [])

    def test_descriptive_metrics_rejects_unlisted_identifier(self):
        from backend.analytics import descriptive

        class Recorder:
            def __init__(self):
                self.read_calls = []

            def get_tables(self):
                return ["ed_visits"]

            def read_sql(self, sql, params=()):
                self.read_calls.append(sql)
                return pd.DataFrame()

        recorder = Recorder()
        original = descriptive.db_manager
        descriptive.db_manager = recorder
        try:
            result = descriptive.get_table_descriptive_metrics('x" UNION SELECT 1 --')
        finally:
            descriptive.db_manager = original

        self.assertIn("error", result)
        self.assertEqual(recorder.read_calls, [])


if __name__ == "__main__":
    unittest.main()
