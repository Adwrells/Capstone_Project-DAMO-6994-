from typing import List, Dict, Any

POPULATION_CATEGORY_MAP = {
    "0-19": "Pediatric & Youth",
    "0–19": "Pediatric & Youth",
    "20-44": "Young Adult",
    "20–44": "Young Adult",
    "45-64": "Middle Adult",
    "45–64": "Middle Adult",
    "65+": "Older Adult",
    "65 and over": "Older Adult",
    "65 and older": "Older Adult",
}

def remove_duplicates(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    deduped = []
    for r in records:
        key = tuple(sorted((k, str(v)) for k, v in r.items()))
        if key not in seen:
            seen.add(key)
            deduped.append(r)
    return deduped

def clean_missing_values(records: List[Dict[str, Any]], fill_value: Any = None) -> List[Dict[str, Any]]:
    cleaned = []
    for r in records:
        new_r = {}
        for k, v in r.items():
            if v is None or str(v).strip().lower() in ("", "null", "none", "nan", "n/a"):
                new_r[k] = fill_value
            else:
                new_r[k] = v
        cleaned.append(new_r)
    return cleaned

def normalize_column_names(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    def to_snake(key: str) -> str:
        return key.strip().lower().replace(" ", "_").replace("-", "_")
    return [{to_snake(k): v for k, v in r.items()} for r in records]

def add_population_category(records: List[Dict[str, Any]], age_col: str = "age_group") -> List[Dict[str, Any]]:
    for r in records:
        raw = str(r.get(age_col, "")).strip()
        category = "Unknown"
        for pattern, label in POPULATION_CATEGORY_MAP.items():
            if pattern.lower() in raw.lower():
                category = label
                break
        r["population_category"] = category
    return records

def add_los_columns(records: List[Dict[str, Any]], minutes_col: str = "median_length_of_stay_min") -> List[Dict[str, Any]]:
    for r in records:
        los_min = r.get(minutes_col) or r.get("median_los_minutes") or 0
        try:
            los_min = float(los_min)
        except (ValueError, TypeError):
            los_min = 0.0
        r["median_los_minutes"] = round(los_min, 2)
        r["median_los_hours"] = round(los_min / 60.0, 4)
    return records
