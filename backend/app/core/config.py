from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Blog Platform API"
    SQLALCHEMY_DATABASE_URL: str = "sqlite+aiosqlite:///./blog.db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    JWT_SECRET_KEY: str = "change-me"  # In production, use env var
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"


settings = Settings()
