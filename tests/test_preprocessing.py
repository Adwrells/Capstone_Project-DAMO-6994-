"""
Healthcare Analytics Platform — Preprocessing Test Suite
==========================================================
Covers: cleaning, feature_engineering, transformations, validation
Run:    python -m pytest tests/ -v --tb=short
"""

import sys
import logging
from pathlib import Path
from datetime import datetime

# ─── Path setup ──────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# ─── Logging to logs/ ────────────────────────────────────────────────────────
LOG_DIR = PROJECT_ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)

log_filename = LOG_DIR / f"test_run_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[
        logging.FileHandler(log_filename, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger("test_preprocessing")
logger.info("Test session started — log: %s", log_filename)

import pytest

from backend.preprocessing.cleaning import remove_duplicates, clean_missing_values
from backend.preprocessing.feature_engineering import extract_year_from_period, encode_sex_category
from backend.preprocessing.transformations import aggregate_by_group
from backend.preprocessing.validation import validate_schema, calculate_null_ratios

# =============================================================================
# ── CLEANING TESTS ────────────────────────────────────────────────────────────
# =============================================================================

class TestRemoveDuplicates:
    def test_no_duplicates_unchanged(self):
        records = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
        assert len(remove_duplicates(records)) == 2

    def test_exact_duplicates_removed(self):
        records = [{"id": 1, "val": "x"}, {"id": 1, "val": "x"}]
        assert len(remove_duplicates(records)) == 1

    def test_partial_duplicates_kept(self):
        records = [{"id": 1, "val": "x"}, {"id": 1, "val": "y"}]
        assert len(remove_duplicates(records)) == 2

    def test_empty_list_returns_empty(self):
        assert remove_duplicates([]) == []

    def test_single_record_returned(self):
        assert len(remove_duplicates([{"id": 99}])) == 1

    def test_multiple_duplicates_in_series(self):
        assert len(remove_duplicates([{"a": 1}] * 3)) == 1

    def test_order_preserved(self):
        records = [{"id": 1}, {"id": 2}, {"id": 1}]
        result = remove_duplicates(records)
        assert [r["id"] for r in result] == [1, 2]

    def test_none_values_consistent(self):
        records = [{"id": None}, {"id": None}]
        assert len(remove_duplicates(records)) == 1


class TestCleanMissingValues:
    def test_none_replaced(self):
        assert clean_missing_values([{"age": None}])[0]["age"] == "N/A"

    def test_empty_string_replaced(self):
        assert clean_missing_values([{"city": ""}])[0]["city"] == "N/A"

    def test_nan_string_replaced(self):
        assert clean_missing_values([{"score": "nan"}])[0]["score"] == "N/A"

    def test_null_string_replaced(self):
        assert clean_missing_values([{"val": "null"}])[0]["val"] == "N/A"

    def test_none_string_replaced(self):
        assert clean_missing_values([{"val": "none"}])[0]["val"] == "N/A"

    def test_valid_values_unchanged(self):
        result = clean_missing_values([{"name": "Alice", "age": 30}])[0]
        assert result["name"] == "Alice" and result["age"] == 30

    def test_custom_fill_value(self):
        assert clean_missing_values([{"x": None}], fill_value=-1)[0]["x"] == -1

    def test_empty_records(self):
        assert clean_missing_values([]) == []

    def test_mixed_fields(self):
        result = clean_missing_values([{"a": None, "b": "hello", "c": ""}])[0]
        assert result["a"] == "N/A" and result["b"] == "hello" and result["c"] == "N/A"

    def test_whitespace_nan_replaced(self):
        assert clean_missing_values([{"v": "  NaN  "}])[0]["v"] == "N/A"


# =============================================================================
# ── FEATURE ENGINEERING TESTS ─────────────────────────────────────────────────
# =============================================================================

class TestExtractYearFromPeriod:
    def test_standard_fiscal_year(self):
        assert extract_year_from_period("2022-2023") == "2022"

    def test_year_only(self):
        assert extract_year_from_period("2019") == "2019"

    def test_q_format(self):
        assert extract_year_from_period("Q1 2021") == "2021"

    def test_empty_string(self):
        assert extract_year_from_period("") == "Unknown"

    def test_none_input(self):
        assert extract_year_from_period(None) == "Unknown"

    def test_short_digits(self):
        assert extract_year_from_period("22") == "Unknown"

    def test_alphanumeric_prefix(self):
        assert extract_year_from_period("FY2024Q2") == "2024"

    def test_no_digits(self):
        assert extract_year_from_period("Annual Report") == "Unknown"


class TestEncodeSexCategory:
    def test_male_full(self):
        assert encode_sex_category("male") == "Male"

    def test_female_full(self):
        assert encode_sex_category("female") == "Female"

    def test_m_abbreviation(self):
        assert encode_sex_category("M") == "Male"

    def test_f_abbreviation(self):
        assert encode_sex_category("F") == "Female"

    def test_numeric_male(self):
        assert encode_sex_category("1") == "Male"

    def test_numeric_female(self):
        assert encode_sex_category("2") == "Female"

    def test_unknown_value(self):
        assert encode_sex_category("X") == "Other/Unknown"

    def test_empty_string(self):
        assert encode_sex_category("") == "Other/Unknown"

    def test_whitespace_trimmed(self):
        assert encode_sex_category("  Male  ") == "Male"

    def test_mixed_case(self):
        assert encode_sex_category("MALE") == "Male"


# =============================================================================
# ── TRANSFORMATIONS TESTS ─────────────────────────────────────────────────────
# =============================================================================

class TestAggregateByGroup:
    def test_basic_aggregation(self):
        records = [{"dept": "A", "visits": 10}, {"dept": "A", "visits": 5}, {"dept": "B", "visits": 7}]
        result = aggregate_by_group(records, "dept", "visits")
        assert result["A"] == 15.0 and result["B"] == 7.0

    def test_empty_records(self):
        assert aggregate_by_group([], "dept", "visits") == {}

    def test_missing_group_key_becomes_unknown(self):
        result = aggregate_by_group([{"visits": 5}], "dept", "visits")
        assert "Unknown" in result and result["Unknown"] == 5.0

    def test_non_numeric_treated_as_zero(self):
        result = aggregate_by_group([{"dept": "A", "visits": "bad"}], "dept", "visits")
        assert result["A"] == 0.0

    def test_float_values(self):
        records = [{"cat": "X", "rate": 1.5}, {"cat": "X", "rate": 2.5}]
        assert abs(aggregate_by_group(records, "cat", "rate")["X"] - 4.0) < 1e-9

    def test_missing_value_col_defaults_to_zero(self):
        assert aggregate_by_group([{"dept": "A"}], "dept", "visits")["A"] == 0.0

    def test_multiple_groups(self):
        records = [{"g": str(i % 3), "v": 1} for i in range(9)]
        result = aggregate_by_group(records, "g", "v")
        assert all(result[k] == 3.0 for k in ["0", "1", "2"])


# =============================================================================
# ── VALIDATION TESTS ──────────────────────────────────────────────────────────
# =============================================================================

class TestValidateSchema:
    def test_all_columns_present(self):
        result = validate_schema([{"id": 1, "name": "A", "age": 30}], ["id", "name", "age"])
        assert result["valid"] is True and result["missing_columns"] == []

    def test_missing_column_detected(self):
        result = validate_schema([{"id": 1, "name": "A"}], ["id", "name", "age"])
        assert result["valid"] is False and "age" in result["missing_columns"]

    def test_empty_records(self):
        result = validate_schema([], ["id"])
        assert result["valid"] is False and result["row_count"] == 0

    def test_no_required_columns_always_valid(self):
        assert validate_schema([{"id": 1}], [])["valid"] is True

    def test_row_count_accurate(self):
        assert validate_schema([{"id": i} for i in range(5)], [])["row_count"] == 5

    def test_multiple_missing_columns(self):
        result = validate_schema([{"id": 1}], ["id", "name", "dob", "gender"])
        assert set(result["missing_columns"]) == {"name", "dob", "gender"}


class TestCalculateNullRatios:
    def test_all_values_present(self):
        result = calculate_null_ratios([{"a": 1, "b": 2}, {"a": 3, "b": 4}])
        assert result["a"] == 0.0 and result["b"] == 0.0

    def test_fifty_percent_nulls(self):
        assert calculate_null_ratios([{"x": None}, {"x": 5}])["x"] == 50.0

    def test_hundred_percent_nulls(self):
        assert calculate_null_ratios([{"x": None}, {"x": None}])["x"] == 100.0

    def test_empty_string_counts_as_null(self):
        assert calculate_null_ratios([{"col": ""}, {"col": "val"}])["col"] == 50.0

    def test_na_string_counts_as_null(self):
        assert calculate_null_ratios([{"col": "N/A"}, {"col": "real"}])["col"] == 50.0

    def test_empty_records_returns_empty(self):
        assert calculate_null_ratios([]) == {}

    def test_multiple_columns_independent(self):
        result = calculate_null_ratios([{"a": None, "b": 1}, {"a": 2, "b": None}])
        assert result["a"] == 50.0 and result["b"] == 50.0

    def test_ratio_rounded_two_decimals(self):
        records = [{"x": None}] + [{"x": i} for i in range(2)]
        assert calculate_null_ratios(records)["x"] == round((1 / 3) * 100, 2)


# =============================================================================
# ── INTEGRATION TESTS ─────────────────────────────────────────────────────────
# =============================================================================

class TestIntegration:
    def test_full_cleaning_pipeline(self):
        raw = [
            {"patient_id": "P001", "age": None, "gender": "male", "visits": "5"},
            {"patient_id": "P001", "age": None, "gender": "male", "visits": "5"},
            {"patient_id": "P002", "age": 45, "gender": "f", "visits": ""},
        ]
        deduped = remove_duplicates(raw)
        assert len(deduped) == 2
        cleaned = clean_missing_values(deduped)
        assert cleaned[0]["age"] == "N/A"
        assert cleaned[1]["visits"] == "N/A"
        assert validate_schema(cleaned, ["patient_id", "age", "gender", "visits"])["valid"] is True
        assert encode_sex_category(cleaned[0]["gender"]) == "Male"
        assert encode_sex_category(cleaned[1]["gender"]) == "Female"

    def test_aggregation_after_cleaning(self):
        raw = [{"dept": "ED", "admissions": None}, {"dept": "ED", "admissions": 10}, {"dept": "ICU", "admissions": 3}]
        cleaned = clean_missing_values(raw, fill_value=0)
        result = aggregate_by_group(cleaned, "dept", "admissions")
        assert result["ED"] == 10.0 and result["ICU"] == 3.0

    def test_null_ratio_post_cleaning(self):
        raw = [{"x": None}, {"x": "hello"}]
        cleaned = clean_missing_values(raw)
        ratios = calculate_null_ratios(cleaned)
        assert ratios["x"] == 50.0

    def test_year_extraction_batch(self):
        periods = ["2020-2021", "FY2022Q3", "", None, "Q4 2023"]
        expected = ["2020", "2022", "Unknown", "Unknown", "2023"]
        assert [extract_year_from_period(p) for p in periods] == expected
