"""
Healthcare Analytics Platform - Preprocessing: Transformations Module
Provides aggregation, column renaming, reshaping, and numeric conversions.
"""

from typing import List, Dict, Any

def aggregate_by_group(records: List[Dict[str, Any]], group_col: str, val_col: str) -> Dict[str, float]:
    """Aggregates numeric column sums grouped by categorical key."""
    totals: Dict[str, float] = {}
    for r in records:
        group_key = str(r.get(group_col, "Unknown"))
        raw_val = r.get(val_col, 0)
        try:
            val = float(raw_val)
        except (ValueError, TypeError):
            val = 0.0
        totals[group_key] = totals.get(group_key, 0.0) + val
    return totals
