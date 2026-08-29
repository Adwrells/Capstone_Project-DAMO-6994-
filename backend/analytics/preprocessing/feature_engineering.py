from typing import List, Dict, Any

def extract_fiscal_year(period_str: str) -> str:
    if not period_str:
        return "Unknown"
    digits = "".join(c for c in period_str if c.isdigit())
    return digits[:4] if len(digits) >= 4 else "Unknown"

def extract_year_from_period(period_str: str) -> int:
    """Extracts starting fiscal year or calendar year as integer from period string."""
    if not period_str:
        return 2000
    digits = "".join(c for c in period_str if c.isdigit())
    if len(digits) >= 4:
        try:
            return int(digits[:4])
        except ValueError:
            return 2000
    return 2000

def encode_sex_category(sex_str: str) -> str:
    s = sex_str.strip().lower() if sex_str else ""
    if s in ("m", "male", "1"):
        return "Male"
    if s in ("f", "female", "2"):
        return "Female"
    return "Other/Unknown"

def encode_admission_flag(disposition_str: str) -> int:
    s = disposition_str.strip().lower() if disposition_str else ""
    return 1 if any(k in s for k in ("admit", "admitted", "inpatient", "hospitali")) else 0

def add_ctas_urgency_score(records: List[Dict[str, Any]], level_col: str = "triage_level") -> List[Dict[str, Any]]:
    for r in records:
        try:
            level = int(r.get(level_col) or 0)
            r["ctas_urgency_score"] = max(1, 6 - level)
        except (ValueError, TypeError):
            r["ctas_urgency_score"] = 0
    return records

def add_admission_status(records: List[Dict[str, Any]], disposition_col: str = "visit_disposition") -> List[Dict[str, Any]]:
    for r in records:
        raw = str(r.get(disposition_col, "")).strip()
        flag = encode_admission_flag(raw)
        r["admission_flag"] = flag
        r["admission_status"] = "Admitted" if flag == 1 else "Discharged"
    return records

def enrich_records(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    records = add_admission_status(records)
    records = add_ctas_urgency_score(records)
    return records
