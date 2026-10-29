from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .services.llm_service import llm_service
from .routers import (
    safety,
    crack,
    estimation,
    planning,
    valuation,
    site,
    weather,
    knowledge
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("construction_intelligence")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent multimodal decision-support system for construction planning, safety, crack detection, valuation, and monitoring."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(safety.router, prefix=settings.API_V1_STR)
app.include_router(crack.router, prefix=settings.API_V1_STR)
app.include_router(estimation.router, prefix=settings.API_V1_STR)
app.include_router(planning.router, prefix=settings.API_V1_STR)
app.include_router(valuation.router, prefix=settings.API_V1_STR)
app.include_router(site.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    # In production, serve the built React app at the same origin as the API.
    # Keep the JSON root response for backend-only development and tests.
    candidates = [Path(__file__).resolve().parent / "static" / "index.html"]
    if os.getenv("SERVE_FRONTEND", "false").lower() in {"1", "true", "yes"}:
        candidates.append(Path(__file__).resolve().parents[2] / "frontend" / "dist" / "index.html")
    for index_file in candidates:
        if index_file.is_file():
            return FileResponse(index_file)
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "multimodal_ai_live": llm_service.is_live_ai_available(),
        "model": settings.DEFAULT_MODEL
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_connected": llm_service.is_live_ai_available(),
        "active_modules": [
            "safety_monitoring",
            "crack_detection",
            "material_estimation",
            "project_planning",
            "real_estate_valuation",
            "daily_site_assistance",
            "weather_advisory",
            "knowledge_assistant"
        ]
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred in Construction Intelligence Platform.", "error": str(exc)}
    )


# Static frontend fallback is registered after API routes so API endpoints win.
_static_candidates = [
    Path(__file__).resolve().parent / "static",
    Path(__file__).resolve().parents[2] / "frontend" / "dist",
]
for _static_dir in _static_candidates:
    _is_project_dist = _static_dir.name == "dist"
    _serve_frontend = os.getenv("SERVE_FRONTEND", "false").lower() in {"1", "true", "yes"}
    if (_static_dir / "index.html").is_file() and (not _is_project_dist or _serve_frontend):
        app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="frontend")
        break
