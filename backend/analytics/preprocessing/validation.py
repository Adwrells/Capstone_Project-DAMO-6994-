from typing import List, Dict, Any

def validate_schema(records: List[Dict[str, Any]], required_columns: List[str]) -> Dict[str, Any]:
    if not records:
        return {"valid": False, "missing_columns": required_columns, "row_count": 0}
    present = set(records[0].keys())
    missing = [col for col in required_columns if col not in present]
    return {
        "valid": len(missing) == 0,
        "missing_columns": missing,
        "present_columns": list(present),
        "row_count": len(records),
    }

def calculate_null_ratios(records: List[Dict[str, Any]]) -> Dict[str, float]:
    if not records:
        return {}
    total = len(records)
    columns = list(records[0].keys())
    null_counts = {col: 0 for col in columns}
    for r in records:
        for col in columns:
            v = r.get(col)
            if v is None or str(v).strip().lower() in ("", "null", "none", "nan", "n/a"):
                null_counts[col] += 1
    return {col: round((count / total) * 100, 2) for col, count in null_counts.items()}

def infer_column_types(records: List[Dict[str, Any]]) -> Dict[str, str]:
    if not records:
        return {}
    columns = list(records[0].keys())
    types: Dict[str, str] = {}
    for col in columns:
        for r in records:
            v = r.get(col)
            if v is None or str(v).strip().lower() in ("", "null", "none", "nan"):
                continue
            if isinstance(v, bool):
                types[col] = "bool"
            elif isinstance(v, int):
                types[col] = "int"
            elif isinstance(v, float):
                types[col] = "float"
            elif isinstance(v, str):
                try:
                    int(v)
                    types[col] = "int"
                except ValueError:
                    try:
                        float(v)
                        types[col] = "float"
                    except ValueError:
                        types[col] = "str"
            else:
                types[col] = "str"
            break
        else:
            types[col] = "unknown"
    return types

def run_health_check(records: List[Dict[str, Any]], required_columns: List[str]) -> Dict[str, Any]:
    schema = validate_schema(records, required_columns)
    null_ratios = calculate_null_ratios(records)
    col_types = infer_column_types(records)
    schema_score = 100.0 if schema["valid"] else max(0.0, 100.0 - len(schema["missing_columns"]) * 20)
    avg_null = sum(null_ratios.values()) / max(1, len(null_ratios)) if null_ratios else 0.0
    null_score = max(0.0, 100.0 - avg_null)
    health_score = round((schema_score + null_score) / 2.0, 1)
    return {
        "schema_validation": schema,
        "null_ratios": null_ratios,
        "column_types": col_types,
        "health_score": health_score,
        "health_status": (
            "Excellent" if health_score >= 90
            else "Good" if health_score >= 75
            else "Fair" if health_score >= 50
            else "Poor"
        ),
    }
