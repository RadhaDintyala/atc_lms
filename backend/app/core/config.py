import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ApexLMS Engineering Project Roadmap"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-jwt-encryption-key-for-engineering-lms-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    
    # MongoDB Database Configuration
    MONGO_HOST: str = os.getenv("MONGO_HOST", "localhost")
    MONGO_PORT: int = int(os.getenv("MONGO_PORT", "27017"))
    MONGO_USER: str = os.getenv("MONGO_USER", "")
    MONGO_PASSWORD: str = os.getenv("MONGO_PASSWORD", "")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "apexlms_db")
    
    # Derived or explicit MongoDB Connection URI
    MONGO_URI: str = os.getenv(
        "MONGO_URI",
        f"mongodb://{f'{MONGO_USER}:{MONGO_PASSWORD}@' if MONGO_USER and MONGO_PASSWORD else ''}{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}?authSource=admin"
        if MONGO_USER else f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}"
    )

    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
