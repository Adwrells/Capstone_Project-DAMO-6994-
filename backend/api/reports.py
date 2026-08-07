"""
Healthcare Analytics Platform - API Router: Report Exports & Audit Logging
"""

from typing import Dict, Any

try:
    from fastapi import APIRouter
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/export-summary")
async def get_report_summary() -> Dict[str, Any]:
    """Generates summary export metadata for PDF/CSV reports."""
    return {
        "success": True,
        "export_ready": True,
        "format_options": ["CSV", "XLSX", "ZIP", "PDF"]
    }
