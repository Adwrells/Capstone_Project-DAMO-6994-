"""
Healthcare Analytics Platform - Preprocessing: Data Validation Module
Provides schema validation, null ratio calculation, data type inference, and health checks.
"""

from typing import List, Dict, Any

def validate_schema(records: List[Dict[str, Any]], required_columns: List[str]) -> Dict[str, Any]:
    """Validates presence of required columns and computes overall schema completeness."""
    if not records:
        return {"valid": False, "missing_columns": required_columns, "row_count": 0}
    
    first_row = records[0]
    present_columns = set(first_row.keys())
    missing = [col for col in required_columns if col not in present_columns]
    
    return {
        "valid": len(missing) == 0,
        "missing_columns": missing,
        "present_columns": list(present_columns),
        "row_count": len(records)
    }

def calculate_null_ratios(records: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculates missing value percentage per column across dataset records."""
    if not records:
        return {}
    
    total_rows = len(records)
    columns = list(records[0].keys())
    null_counts = {col: 0 for col in columns}
    
    for r in records:
        for col in columns:
            v = r.get(col)
            if v is None or v == "" or str(v).strip().lower() in ("null", "none", "nan", "n/a"):
                null_counts[col] += 1
                
    return {col: round((count / total_rows) * 100, 2) for col, count in null_counts.items()}
