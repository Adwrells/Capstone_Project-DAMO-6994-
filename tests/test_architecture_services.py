import pytest

from backend.services.preprocessing_service import PreprocessingService
from backend.services.analytics_service import AnalyticsService


def test_preprocessing_pipeline_builds_cleaned_dataset_summary():
    records = [
        {"date": "2023-01-01", "age": 25, "sex": "M", "visits": 100, "main_problem": ""},
        {"date": "2023-01-02", "age": None, "sex": "Female", "visits": 120, "main_problem": "Chest Pain"},
        {"date": "2023-01-02", "age": 25, "sex": "M", "visits": 100, "main_problem": "Chest Pain"},
    ]

    result = PreprocessingService.process_dataset(records, required_columns=["date", "age", "sex", "visits"])

    assert result["summary"]["row_count"] == 3
    assert result["summary"]["quality_score"] >= 70
    assert result["cleaned_records"][0]["sex_category"] == "Male"
    assert result["cleaned_records"][1]["age"] == "Unknown"
    assert result["cleaned_records"][2]["is_duplicate"] is False


def test_pipeline_overview_reports_architecture_stages():
    overview = AnalyticsService.get_pipeline_overview()

    assert overview["status"] == "ready"
    assert overview["stages"]["cleaning"]["status"] == "ready"
    assert overview["stages"]["processing"]["status"] == "ready"
    assert overview["stages"]["visualization"]["status"] == "ready"
