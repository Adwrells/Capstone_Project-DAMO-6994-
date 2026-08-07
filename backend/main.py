"""
Healthcare Analytics Platform - Main FastAPI Enterprise Server
"""

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
except ImportError:
    class FastAPI:
        def __init__(self, *args, **kwargs): pass
        def add_middleware(self, *args, **kwargs): pass
        def include_router(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
    class CORSMiddleware: pass

try:
    from backend.api import upload, datasets, statistics, dashboard, insights, reports, dataset_explorer_api, model_diagnostics, architecture, user_datasets
except ImportError:
    from api import upload, datasets, statistics, dashboard, insights, reports, dataset_explorer_api, model_diagnostics, architecture, user_datasets

app = FastAPI(
    title="Healthcare Analytics Platform API",
    description="Enterprise Analytics & Machine Learning Engine for Emergency Department Data",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(upload.router)
app.include_router(datasets.router)
app.include_router(dataset_explorer_api.router)
app.include_router(statistics.router)
app.include_router(dashboard.router)
app.include_router(insights.router)
app.include_router(reports.router)
app.include_router(model_diagnostics.router)
app.include_router(architecture.router)
app.include_router(user_datasets.router)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "Healthcare Analytics Platform API",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import os
    import uvicorn

    # Bind loopback by default. The previous 0.0.0.0 exposed this API — which serves the
    # full clinical dataset with CORS wide open — to every device on the local network.
    # Set API_HOST=0.0.0.0 explicitly when running in a container or serving other hosts.
    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", "8000"))

    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
