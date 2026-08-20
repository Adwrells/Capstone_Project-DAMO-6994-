"""
Healthcare Analytics Platform - Backend Configuration Settings
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = BASE_DIR / "backend" / "database" / "healthcare.db"

HOST = os.getenv("API_HOST", os.getenv("HOST", "127.0.0.1"))
PORT = int(os.getenv("API_PORT", os.getenv("PORT", "8000")))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
