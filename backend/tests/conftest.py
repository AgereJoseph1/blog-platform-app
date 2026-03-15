import asyncio
from collections.abc import AsyncGenerator
from typing import Generator

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.api.routes import auth, posts
from app.db.session import Base, get_db, AsyncSessionLocal


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    engine = create_async_engine("sqlite+aiosqlite:///./test.db", future=True, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture(scope="function")
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    TestingSessionLocal = sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )
    async with TestingSessionLocal() as session:
        yield session


@pytest.fixture(scope="function")
async def app_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    app = FastAPI()

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    app.include_router(auth.router)
    app.include_router(posts.router)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
