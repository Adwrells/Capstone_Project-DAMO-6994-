"""Overfitting / underfitting diagnostics for the post-cleaning dataset."""

from typing import Any, Dict, List, Optional

try:
    from fastapi import APIRouter
    from pydantic import BaseModel
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs):
            pass

        def get(self, *args, **kwargs):
            return lambda f: f

        def post(self, *args, **kwargs):
            return lambda f: f

    class BaseModel:
        pass

try:
    from backend.services.model_diagnostics_service import model_diagnostics_service
except ImportError:
    from services.model_diagnostics_service import model_diagnostics_service

router = APIRouter(prefix="/api/model-diagnostics", tags=["Model Diagnostics"])


class DiagnosticsRequest(BaseModel):
    records: List[Dict[str, Any]] = []
    feature: str = ""
    target: str = ""
    degree: int = 1
    test_ratio: float = 0.3
    seed: int = 42


class ColumnsRequest(BaseModel):
    records: List[Dict[str, Any]] = []


@router.post("/assess")
def assess_fit(payload: DiagnosticsRequest) -> Dict[str, Any]:
    """Assess whether a model fitted on the cleaned dataset over- or underfits."""
    if not payload.feature or not payload.target:
        return {
            "success": False,
            "status": "invalid_request",
            "message": "Both 'feature' and 'target' column names are required.",
        }

    result = model_diagnostics_service.diagnose(
        records=payload.records,
        feature=payload.feature,
        target=payload.target,
        degree=payload.degree,
        test_ratio=payload.test_ratio,
        seed=payload.seed,
    )
    return {"success": result["status"] == "ok", **result}


@router.post("/columns")
def modelable_columns(payload: ColumnsRequest) -> Dict[str, Any]:
    """Numeric columns in the cleaned dataset that can serve as feature or target."""
    columns = model_diagnostics_service.numeric_columns(payload.records)
    return {"success": True, "columns": columns, "count": len(columns)}
