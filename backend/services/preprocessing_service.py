"""Service layer for the architecture-aligned preprocessing pipeline."""

from typing import Any, Dict, List

from backend.preprocessing.cleaning import clean_missing_values, remove_duplicates
from backend.preprocessing.feature_engineering import encode_sex_category, extract_year_from_period

# Validation must come from the record-based package. backend/preprocessing/validation.py
# has same-named functions that take pandas DataFrames — importing those raises TypeError
# at call time. See architecture.md §3.4 on the two parallel preprocessing packages.
from backend.analytics.preprocessing.validation import calculate_null_ratios, validate_schema


class PreprocessingService:
    """Orchestrates cleaning, validation, and feature engineering for raw records."""

    @staticmethod
    def process_dataset(records: List[Dict[str, Any]], required_columns: List[str]) -> Dict[str, Any]:
        if not records:
            return {
                "cleaned_records": [],
                "summary": {
                    "row_count": 0,
                    "column_count": 0,
                    "quality_score": 0,
                    "missing_values": {},
                },
            }

        schema_result = validate_schema(records, required_columns)
        cleaned = clean_missing_values(records, fill_value="Unknown")
        cleaned = remove_duplicates(cleaned)
        enriched: List[Dict[str, Any]] = []

        for row in cleaned:
            enriched_row = dict(row)
            enriched_row["sex_category"] = encode_sex_category(enriched_row.get("sex", ""))
            enriched_row["year"] = extract_year_from_period(enriched_row.get("date", ""))
            enriched_row["is_duplicate"] = False
            enriched.append(enriched_row)

        null_ratios = calculate_null_ratios(enriched)
        quality_score = max(60, 100 - int(sum(null_ratios.values()) / max(1, len(null_ratios))))

        return {
            "cleaned_records": enriched,
            "schema": schema_result,
            "summary": {
                "row_count": len(enriched),
                "column_count": len(enriched[0].keys()) if enriched else 0,
                "quality_score": quality_score,
                "missing_values": null_ratios,
            },
        }


preprocessing_service = PreprocessingService()
