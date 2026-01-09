from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api.auth import router as auth_router
from .api.tasks import router as tasks_router
from .database import engine, create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler - creates tables on startup"""
    # Startup: Create tables if they don't exist
    if engine:
        create_db_and_tables()
    yield
    # Shutdown: cleanup if needed


# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="RESTful API for multi-user todo management with JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS properly
# Default to development settings if ENVIRONMENT is not set or is "development"
environment = os.getenv("ENVIRONMENT", "development")
if environment == "development":
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:8080",  # Added for Better Auth
        "http://127.0.0.1:8080", # Added for Better Auth
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
else:
    origins = [os.getenv("FRONTEND_URL", "https://yourdomain.com")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Todo API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
