import os
from pathlib import Path

BASE_DIR: Path = Path(__file__).parent.parent.parent
DATA_DIR: Path = BASE_DIR / "data"
RAW_DIR: Path = DATA_DIR / "raw"
OPTIMIZED_DIR: Path = DATA_DIR / "optimized"
EXPLORER_DIR: Path = DATA_DIR / "explorer"
SQLITE_DIR: Path = DATA_DIR / "sqlite"
EXPORTS_DIR: Path = DATA_DIR / "exports"
DATABASE_PATH: Path = SQLITE_DIR / "healthcare.db"
REPORTS_DIR: Path = BASE_DIR / "reports"
DOCUMENTATION_DIR: Path = BASE_DIR / "documentation"

HOST: str = os.getenv("HOST", "0.0.0.0")
PORT: int = int(os.getenv("PORT", "8000"))
DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
ALPHA: float = float(os.getenv("ALPHA", "0.05"))
FORECAST_ALPHA: float = float(os.getenv("FORECAST_ALPHA", "0.3"))
FORECAST_HORIZON: int = int(os.getenv("FORECAST_HORIZON", "5"))

AGE_GROUPS = ["0-19", "20-44", "45-64", "65+"]
POPULATION_CATEGORIES = {
    "0-19": "Pediatric & Youth",
    "20-44": "Young Adult",
    "45-64": "Middle Adult",
    "65+": "Older Adult",
}
