"""
Healthcare Analytics Platform - Preprocessing: Feature Engineering Module
Generates derived temporal features, demographic age categorization,
triage severity scores, length of stay conversions, and admission indicators.
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np


def extract_year_from_period(period_str: str) -> int:
    """Extracts starting fiscal year or calendar year as integer from period string."""
    if not period_str:
        return 2000
    digits = "".join([c for c in str(period_str) if c.isdigit()])
    if len(digits) >= 4:
        try:
            return int(digits[:4])
        except ValueError:
            return 2000
    return 2000


def encode_sex_category(sex_str: str) -> str:
    """Standardizes sex categories to Male, Female, or Other/Unknown/All."""
    s = str(sex_str).strip().lower()
    if s in ("m", "male", "1"):
        return "Male"
    elif s in ("f", "female", "2"):
        return "Female"
    elif s in ("all", "total", "both"):
        return "All"
    return "Other/Unknown"


def map_ctas_urgency(triage_str: str) -> int:
    """Maps CTAS triage text levels to numerical urgency scores (1=Resuscitation to 5=Non-Urgent)."""
    t = str(triage_str).lower()
    if "1" in t or "resuscitation" in t:
        return 1
    elif "2" in t or "emergent" in t:
        return 2
    elif "3" in t or "urgent" in t:
        return 3
    elif "4" in t or "less" in t:
        return 4
    elif "5" in t or "non" in t:
        return 5
    return 3  # Default to moderate urgency


def classify_age_group(age_str: str) -> str:
    """Classifies granular age strings into broad demographic tiers (Pediatric, Adult, Senior)."""
    a = str(age_str).lower()
    if any(k in a for k in ["<1", "1–4", "1-4", "5–14", "5-14", "15–17", "15-17", "child", "pediatric", "infant"]):
        return "Pediatric"
    elif any(k in a for k in ["65", "75", "85", "senior", "elderly"]):
        return "Senior"
    return "Adult"


def add_feature_engineering(datasets: Dict[str, pd.DataFrame]) -> Dict[str, pd.DataFrame]:
    """
    Applies domain feature engineering across all six datasets:
    - fiscal_year_start
    - ctas_urgency_score (where applicable)
    - age_broad_category (where applicable)
    - is_admitted (where applicable)
    - length_of_stay_hours
    """
    engineered = {}

    for key, df in datasets.items():
        df_copy = df.copy()

        # 1. Fiscal Year Start
        if "fiscal_year" in df_copy.columns:
            df_copy["fiscal_year_start"] = df_copy["fiscal_year"].apply(extract_year_from_period)

        # 2. Length of stay in hours
        if "median_length_of_stay_min" in df_copy.columns:
            df_copy["length_of_stay_hours"] = (df_copy["median_length_of_stay_min"] / 60.0).round(2)
        elif "avg_length_of_stay_min" in df_copy.columns:
            df_copy["length_of_stay_hours"] = (df_copy["avg_length_of_stay_min"] / 60.0).round(2)

        # 3. CTAS Urgency Score
        if "triage_level" in df_copy.columns:
            df_copy["ctas_urgency_score"] = df_copy["triage_level"].apply(map_ctas_urgency)

        # 4. Age Broad Category
        if "age_group" in df_copy.columns:
            df_copy["age_broad_category"] = df_copy["age_group"].apply(classify_age_group)

        # 5. Admission Flag
        if "visit_disposition" in df_copy.columns:
            df_copy["is_admitted"] = df_copy["visit_disposition"].apply(
                lambda x: 1 if "admit" in str(x).lower() else 0
            )

        engineered[key] = df_copy

    return engineered
