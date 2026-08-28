import logging
import os
import secrets
from pathlib import Path

from dotenv import load_dotenv

logger = logging.getLogger(__name__)

BASE_DIR: Path = Path(__file__).parent.parent.parent

# Resolved against BASE_DIR rather than cwd, so this loads correctly regardless of which
# directory a command was run from. Does not override a variable already set in the real
# environment (load_dotenv's default), so Docker/CI env vars still win over a stray .env.
load_dotenv(BASE_DIR / ".env")
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

# ─── Auth (single seeded account, see backend/auth/) ────────────────────────
AUTH_USERNAME: str = os.getenv("AUTH_USERNAME", "admin")
AUTH_PASSWORD: str = os.getenv("AUTH_PASSWORD", "changeme")
JWT_ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

_env_secret = os.getenv("SECRET_KEY", "")
if _env_secret:
    SECRET_KEY: str = _env_secret
else:
    # Ephemeral per-process secret: every restart invalidates outstanding tokens,
    # which is fine for local dev/tests but not for a real deployment — a production
    # run should set SECRET_KEY explicitly so tokens survive a restart/redeploy.
    SECRET_KEY = secrets.token_hex(32)
    if not DEBUG:
        logger.warning(
            "SECRET_KEY is not set; using an ephemeral per-process secret. "
            "Set the SECRET_KEY environment variable for a real deployment."
        )

AGE_GROUPS = ["0-19", "20-44", "45-64", "65+"]
POPULATION_CATEGORIES = {
    "0-19": "Pediatric & Youth",
    "20-44": "Young Adult",
    "45-64": "Middle Adult",
    "65+": "Older Adult",
}
