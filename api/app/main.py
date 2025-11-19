"""FastAPI main application"""
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from .config import settings
from .database import engine, Base
from .routers import auth, listings, messages, favorites


# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    # Startup: Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: Cleanup if needed


# Create FastAPI app
app = FastAPI(
    title="Classifieds Marketplace API",
    description="POC API for classifieds marketplace",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(messages.router)
app.include_router(favorites.router)


# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


# Root endpoint
@app.get("/", status_code=status.HTTP_200_OK)
def root():
    """Root endpoint"""
    return {
        "message": "Classifieds Marketplace API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle all unhandled exceptions"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )
