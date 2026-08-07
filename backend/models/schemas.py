"""
Healthcare Analytics Platform - Data Models & DTO Schemas
"""

from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional

@dataclass
class DatasetMeta:
    name: str
    row_count: int
    column_count: int
    file_size: Optional[str] = None

    def dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class StatisticsRequest:
    values: List[float]
    confidence_level: Optional[float] = 0.95

    def dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class KPIResponse:
    total_ed_visits: int
    admission_rate: str
    top_condition: str
    active_provincial_reports: int

    def dict(self) -> Dict[str, Any]:
        return asdict(self)
