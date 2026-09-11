"""
Healthcare Analytics Platform - API Router: Report Exports & Audit Logging
"""

from pathlib import Path
from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/export-summary")
def get_report_summary() -> Dict[str, Any]:
    """Generates summary export metadata for PDF/CSV reports."""
    return {
        "success": True,
        "export_ready": True,
        "format_options": ["CSV", "XLSX", "ZIP", "PDF"]
    }

@router.get("/final-pdf")
def get_final_report_pdf():
    """Serves the official Final Report Capstone Project PDF."""
    possible_paths = [
        Path(r"C:\Users\bhara\OneDrive\Desktop\Final Report Capstone Project.pdf"),
        Path.cwd() / "public" / "reports" / "Final Report Capstone Project.pdf",
        Path.cwd() / "docs" / "Reports" / "Final Report Capstone Project.pdf",
    ]
    for p in possible_paths:
        if p.is_file():
            return FileResponse(
                path=str(p),
                media_type="application/pdf",
                filename="Final Report Capstone Project.pdf"
            )
    raise HTTPException(status_code=404, detail="Final Report PDF not found")

