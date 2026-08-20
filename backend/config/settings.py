import os
from pathlib import Path

BASE_DIR: Path = Path(__file__).parent.parent.parent
DATA_DIR: Path = BASE_DIR / "data"
RAW_DIR: Path = DATA_DIR / "raw"
EXPLORER_DIR: Path = DATA_DIR / "Explorer Dataset"
CLEANED_DIR: Path = DATA_DIR / "cleaned dataset"
DATABASE_PATH: Path = BASE_DIR / "backend" / "database" / "healthcare.db"
REPORTS_DIR: Path = BASE_DIR / "reports"
DOCUMENTATION_DIR: Path = BASE_DIR / "docs"

HOST: str = os.getenv("API_HOST", os.getenv("HOST", "127.0.0.1"))
PORT: int = int(os.getenv("API_PORT", os.getenv("PORT", "8000")))
DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
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
