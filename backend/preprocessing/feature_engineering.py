"""
Healthcare Analytics Platform - Preprocessing: Feature Engineering Module
Generates derived temporal features, demographic age categorization, and triage severity flags.
"""

import re
from typing import List, Dict, Any

def extract_year_from_period(period_str: str) -> str:
    """Extracts starting fiscal year or calendar year from standard period string.

    Uses regex to find the first 4-digit sequence in the string, correctly
    handling formats like 'Q1 2021', 'FY2022Q3', '2020-2021'.
    """
    if not period_str:
        return "Unknown"
    found = re.search(r"\d{4}", str(period_str))
    return found.group(0) if found else "Unknown"

def encode_sex_category(sex_str: str) -> str:
    """Standardizes sex categories to Male, Female, or Other/Unknown."""
    s = str(sex_str).strip().lower()
    if s in ("m", "male", "1"):
        return "Male"
    elif s in ("f", "female", "2"):
        return "Female"
    return "Other/Unknown"
