from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from app.core.config import settings
from app.db.mongo import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Engineering Project Roadmap LMS supporting 1st, 2nd, and 3rd year engineering students with Full-Stack and AI Engineering tracks.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Beacon Engineering Project Roadmap API",
        "docs": "/docs",
        "version": "1.0.0",
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Beacon FastAPI Backend",
        "version": "1.0.0",
    }
