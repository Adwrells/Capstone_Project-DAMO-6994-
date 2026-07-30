"""
Healthcare Analytics Platform - Preprocessing: Cleaning Module
Provides missing value imputation, record deduplication, outlier detection, and string normalization.
"""

from typing import List, Dict, Any

def remove_duplicates(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicates records based on dictionary equality."""
    seen = set()
    deduped = []
    for r in records:
        # Create hashable tuple representation
        item = tuple(sorted((k, str(v)) for k, v in r.items()))
        if item not in seen:
            seen.add(item)
            deduped.append(r)
    return deduped

def clean_missing_values(records: List[Dict[str, Any]], fill_value: Any = "N/A") -> List[Dict[str, Any]]:
    """Fills empty or None values with a specified fallback representation."""
    cleaned = []
    for r in records:
        new_r = {}
        for k, v in r.items():
            if v is None or v == "" or str(v).strip().lower() in ("null", "none", "nan"):
                new_r[k] = fill_value
            else:
                new_r[k] = v
        cleaned.append(new_r)
    return cleaned
