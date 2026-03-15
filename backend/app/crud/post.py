from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.post import Post


async def create_post(db: AsyncSession, *, title: str, content: str, author_id: int) -> Post:
    post = Post(title=title, content=content, author_id=author_id)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


async def get_post(db: AsyncSession, post_id: int) -> Optional[Post]:
    result = await db.execute(select(Post).where(Post.id == post_id))
    return result.scalars().first()


async def list_posts(db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Post]:
    result = await db.execute(select(Post).offset(skip).limit(limit).order_by(Post.created_at.desc()))
    return list(result.scalars().all())


async def update_post(db: AsyncSession, post: Post, *, title: str | None = None, content: str | None = None) -> Post:
    if title is not None:
        post.title = title
    if content is not None:
        post.content = content
    await db.commit()
    await db.refresh(post)
    return post


async def delete_post(db: AsyncSession, post: Post) -> None:
    await db.delete(post)
    await db.commit()
