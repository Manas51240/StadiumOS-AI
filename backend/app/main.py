import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.core.logging.logger import logger
from app.core.exceptions.exceptions import DomainException
from app.core.exceptions.handlers import domain_exception_handler
from app.core.middleware.middleware import (
    RateLimitMiddleware,
    RequestLoggingMiddleware,
    SecurityHeadersMiddleware,
)

# Import database models to ensure table auto-creation on startup
from app.features.auth.data.models import User
from app.features.crowd.data.models import CrowdAlert
from app.features.navigation.data.models import NavigationNode
from app.features.emergency.data.models import Incident
from app.features.volunteer.data.models import VolunteerTask
from app.features.sustainability.data.models import SustainabilityMetric
from app.features.reports.data.models import OperationReport

# Feature Presentation Routers
from app.features.auth.presentation.routes import router as auth_router
from app.features.crowd.presentation.routes import router as crowd_router
from app.features.navigation.presentation.routes import router as navigation_router
from app.features.emergency.presentation.routes import router as emergency_router
from app.features.volunteer.presentation.routes import router as volunteer_router
from app.features.sustainability.presentation.routes import (
    router as sustainability_router,
)
from app.features.reports.presentation.routes import router as reports_router
from app.features.assistant.presentation.routes import router as assistant_router
from app.features.dashboard.presentation.routes import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Clean Architecture database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down resources...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="Clean Architecture FIFA World Cup 2026 Stadium Operations AI System",
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Control
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware, limit_per_minute=settings.RATE_LIMIT_PER_MINUTE)

# Global Domain Exception Mapper
app.add_exception_handler(DomainException, domain_exception_handler)


# Root Endpoints
@app.get("/")
async def root():
    return {"message": "StadiumOS AI Clean Architecture API. Navigate to /api/v1/docs"}


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}


# Mount Feature Presentation Routers
app.include_router(
    auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"]
)
app.include_router(
    crowd_router, prefix=f"{settings.API_V1_STR}/crowd", tags=["Crowd Congestion"]
)
app.include_router(
    navigation_router,
    prefix=f"{settings.API_V1_STR}/navigation",
    tags=["Interactive Navigation"],
)
app.include_router(
    emergency_router,
    prefix=f"{settings.API_V1_STR}/emergency",
    tags=["Emergency Operations"],
)
app.include_router(
    volunteer_router,
    prefix=f"{settings.API_V1_STR}/volunteer",
    tags=["Volunteer Copilot"],
)
app.include_router(
    sustainability_router,
    prefix=f"{settings.API_V1_STR}/sustainability",
    tags=["Sustainability Analytics"],
)
app.include_router(
    reports_router,
    prefix=f"{settings.API_V1_STR}/reports",
    tags=["AI Operational Reports"],
)
app.include_router(
    assistant_router,
    prefix=f"{settings.API_V1_STR}/assistant",
    tags=["Multilingual AI Assistant"],
)
app.include_router(
    dashboard_router,
    prefix=f"{settings.API_V1_STR}/dashboard",
    tags=["Command Center Metrics"],
)
