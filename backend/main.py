import os
import sys
from pathlib import Path

# Ensure project root is in sys.path so backend modules always resolve
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from backend.api import (
    architecture,
    auth,
    dashboard,
    dataset_explorer_api,
    datasets,
    insights,
    model_diagnostics,
    reports,
    statistics,
    upload,
    user_datasets,
)
from backend.auth.dependencies import get_current_user
from backend.auth.rate_limit import limiter

app = FastAPI(
    title="Healthcare Analytics Platform API",
    description="Enterprise Analytics & Machine Learning Engine for Emergency Department Data",
    version="2.0.0",
)

# Backs the @limiter.limit(...) decorator on /api/auth/login (backend/api/auth.py).
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Enable Cross-Origin Resource Sharing (CORS)
# Support development frontends (Node/Vite) and configurable origins via CORS_ORIGINS env var
cors_origins_env = os.getenv("CORS_ORIGINS", "")
allowed_origins = [
    origin.strip() for origin in cors_origins_env.split(",") if origin.strip()
] if cors_origins_env else [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
# auth is public (it's how a caller gets a token in the first place); every other
# router requires a valid bearer token via the shared get_current_user dependency.
app.include_router(auth.router)

_protected = [Depends(get_current_user)]
app.include_router(upload.router, dependencies=_protected)
app.include_router(datasets.router, dependencies=_protected)
app.include_router(dataset_explorer_api.router, dependencies=_protected)
app.include_router(statistics.router, dependencies=_protected)
app.include_router(dashboard.router, dependencies=_protected)
app.include_router(insights.router, dependencies=_protected)
app.include_router(reports.router, dependencies=_protected)
app.include_router(model_diagnostics.router, dependencies=_protected)
app.include_router(architecture.router, dependencies=_protected)
app.include_router(user_datasets.router, dependencies=_protected)


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "Healthcare Analytics Platform API",
        "version": "1.0.0",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


# Mount production frontend static assets if built
dist_dir = PROJECT_ROOT / "dist"
if dist_dir.exists() and (dist_dir / "index.html").exists():
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    assets_dir = dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            return None
        candidate = dist_dir / full_path
        if candidate.is_file():
            return FileResponse(str(candidate))
        return FileResponse(str(dist_dir / "index.html"))


if __name__ == "__main__":
    import uvicorn

    # Bind loopback by default. Set API_HOST=0.0.0.0 explicitly when running in a container.
    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", "8000"))

    uvicorn.run("backend.main:app", host=host, port=port, reload=True)

