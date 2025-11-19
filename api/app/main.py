"""
CyberBazaar API - Anonymous Marketplace with AI Content Moderation
High-Tech, Low-Life. Year 2077.
"""
from fastapi import FastAPI, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from .config import settings
from .database import engine, Base
from .routers import listings
from .middleware import (
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    ErrorHandlerMiddleware,
    setup_rate_limiting,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    logger.info(">>> Initializing CyberBazaar Systems...")
    # Startup: Create tables
    Base.metadata.create_all(bind=engine)
    logger.info(">>> Database connection established")
    logger.info(">>> Content moderation AI: ONLINE")
    logger.info(">>> Authentication: DISABLED")
    logger.info(">>> CyberBazaar is live. Welcome to 2077.")
    yield
    # Shutdown: Cleanup if needed
    logger.info(">>> Shutting down CyberBazaar systems...")


# Create FastAPI app
app = FastAPI(
    title="CyberBazaar API",
    description="Anonymous marketplace with AI-powered content moderation. No accounts required. Year 2077.",
    version="2077.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup rate limiting
setup_rate_limiting(app)

# Add security middlewares (order matters!)
# 1. Error handler (outermost)
app.add_middleware(ErrorHandlerMiddleware)

# 2. Request logging
app.add_middleware(RequestLoggingMiddleware)

# 3. Security headers
app.add_middleware(SecurityHeadersMiddleware)

# 4. GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 5. CORS - Allow all origins for public marketplace
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Public marketplace - anyone can access
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

# Include routers (only listings - no auth, messages, or favorites)
app.include_router(listings.router)


# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """System diagnostics endpoint"""
    return {
        "status": "ONLINE",
        "marketplace": "CyberBazaar",
        "year": 2077,
        "authentication": "DISABLED",
        "content_moderation": "ACTIVE",
        "environment": settings.ENVIRONMENT
    }


# Root endpoint
@app.get("/", status_code=status.HTTP_200_OK)
def root():
    """Welcome to CyberBazaar"""
    return {
        "message": "Welcome to CyberBazaar",
        "tagline": "High-Tech, Low-Life Marketplace",
        "year": 2077,
        "version": "2077.1.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "listings": "/listings"
        },
        "features": {
            "authentication": False,
            "content_moderation": True,
            "anonymous_posting": True
        }
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle all unhandled exceptions"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "System malfunction",
            "message": "Something went wrong in the matrix",
            "code": "CYBERWARE_FAILURE"
        }
    )
