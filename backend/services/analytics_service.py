"""
Healthcare Analytics Platform - Analytics Service Layer
Decouples API controllers from database queries and analytical engines.
"""

from typing import List, Dict, Any

try:
    from backend.database.database_manager import db_manager
    from backend.analytics.erbi import compute_er_kpis
except ImportError:
    from database.database_manager import db_manager
    from analytics.erbi import compute_er_kpis

class AnalyticsService:

    @staticmethod
    def get_dataset_summary(table_name: str) -> Dict[str, Any]:
        tables = db_manager.get_tables()
        if table_name not in tables:
            return {"error": "Table not found"}
        rows = db_manager.execute_query(f'SELECT * FROM "{table_name}"')
        kpis = compute_er_kpis(rows)
        return {
            "table_name": table_name,
            "row_count": len(rows),
            "kpis": kpis
        }

    @staticmethod
    def get_pipeline_overview() -> Dict[str, Any]:
        """Reports readiness of each analytical pipeline stage.

        Backs GET /api/architecture/pipeline, which the frontend
        ArchitecturePipelineCard renders. Stage readiness reflects whether the
        database layer is actually reachable, not a hardcoded constant.
        """
        try:
            tables = db_manager.get_tables()
            db_ready = True
        except Exception:
            tables = []
            db_ready = False

        stage_status = "ready" if db_ready else "degraded"

        return {
            "status": stage_status,
            "tables_registered": len(tables),
            "stages": {
                "ingestion": {
                    "status": stage_status,
                    "description": "Raw CIHI Excel and CSV files loaded into SQLite via load_csv.",
                },
                "cleaning": {
                    "status": stage_status,
                    "description": "Deduplication, missing-value imputation, and column normalisation.",
                },
                "processing": {
                    "status": stage_status,
                    "description": (
                        "Feature engineering, visit-weighted hypothesis testing (H1-H5), "
                        "and forecasting."
                    ),
                },
                "visualization": {
                    "status": stage_status,
                    "description": "Executive dashboard, dataset explorer, and report exports.",
                },
            },
        }

analytics_service = AnalyticsService()
