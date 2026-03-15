from fastapi import FastAPI

from app.api.routes import auth, posts
from app.db.session import Base, engine

app = FastAPI(title="Blog Platform API")


@app.on_event("startup")
async def on_startup():
    # Create tables for SQLite (simple setup without migrations)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(posts.router)
