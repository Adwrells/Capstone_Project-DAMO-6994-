from typing import Any, Dict, List, Optional

# ─────────────────────────────────────────────────────────────────────────────
# Shared categorical vocabularies
# ─────────────────────────────────────────────────────────────────────────────
# The Explorer exports disagree on how they punctuate age bands: CTAS_Triage.csv
# writes EN DASH (U+2013) as in "00–19", every other export writes an ASCII hyphen
# as in "0-19". A join on age_group across two such files matches nothing at all,
# silently. normalize_age_group collapses both spellings onto one canonical key.

AGE_GROUP_CANONICAL: List[str] = ["0-19", "20-44", "45-64", "65+"]

# Every spelling observed in data/Explorer Dataset, mapped to the canonical band.
AGE_GROUP_MAP: Dict[str, str] = {
    "0-19": "0-19", "0–19": "0-19", "00-19": "0-19", "00–19": "0-19",
    "20-44": "20-44", "20–44": "20-44",
    "45-64": "45-64", "45–64": "45-64",
    "65+": "65+", "65 and over": "65+", "65 and older": "65+", "65-85+": "65+", "65–85+": "65+",
}

# Age band -> life-stage label, in the Explorer four-band vocabulary.
#
# NOTE: this is NOT the vocabulary used by healthcare.db. The cleaned master workbook
# carries a finer FIVE-band scheme ("Pediatric Population", "Young Adult Population",
# "Adult Population", "Pre-Senior Population", "Geriatric Population") over different
# age cuts (0–17, 18–34, 35–49, 50–64, 65–85+). The two come from different source
# tables and are not interconvertible, so nothing translates between them.
POPULATION_CATEGORY_MAP: Dict[str, str] = {
    "0-19": "Pediatric & Youth",
    "0–19": "Pediatric & Youth",
    "00-19": "Pediatric & Youth",
    "00–19": "Pediatric & Youth",
    "20-44": "Young Adult",
    "20–44": "Young Adult",
    "45-64": "Middle Adult",
    "45–64": "Middle Adult",
    "65+": "Older Adult",
    "65 and over": "Older Adult",
    "65 and older": "Older Adult",
}

# Roll-up labels that appear in the same column as the detail rows they summarise.
# Summing ed_visits without removing these double counts every visit.
AGGREGATE_ROW_LABELS: Dict[str, List[str]] = {
    "visit_disposition": ["Total"],
    "main_problem": ["Any"],
    "triage_level": ["Total"],
}


def _normalize_key(value: Any) -> str:
    """Trims, lowercases, and unifies dash characters for vocabulary lookup."""
    text = str(value).strip().lower()
    for dash in ("–", "—", "−"):  # en dash, em dash, minus sign
        text = text.replace(dash, "-")
    return text


def normalize_age_group(value: Any) -> Optional[str]:
    """Maps any observed age_group spelling onto a canonical band.

    Returns the original string when unrecognised, so an unexpected category is
    visible in the output rather than silently dropped.
    """
    if value is None:
        return None
    key = _normalize_key(value)
    for spelling, canonical in AGE_GROUP_MAP.items():
        if _normalize_key(spelling) == key:
            return canonical
    return str(value).strip()


def normalize_population_category(value: Any) -> Optional[str]:
    """Maps an age band or life-stage label onto the Explorer four-band vocabulary."""
    if value is None:
        return None
    key = _normalize_key(value)
    for spelling, label in POPULATION_CATEGORY_MAP.items():
        if _normalize_key(spelling) == key:
            return label
    # Already a life-stage label (or an unrecognised one): pass it through unchanged.
    return str(value).strip()

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
