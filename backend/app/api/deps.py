from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_db_session() -> AsyncSession:
    async for session in get_db():
        return session


async def get_current_user():
    # Will be implemented later
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
