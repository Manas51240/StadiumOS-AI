import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "StadiumOS AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkeyforstadiumosai2026worldcup"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = (
        "sqlite+aiosqlite:////tmp/stadium_os.db"
        if os.getenv("VERCEL") or os.getenv("VERCEL_ENV")
        else "sqlite+aiosqlite:///./stadium_os.db"
    )

    # AI Config
    GEMINI_API_KEY: str = "mock-key-for-stadium-os"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Security
    ALLOWED_ORIGINS: List[str] = ["*"]

    ENVIRONMENT: str = "development"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
