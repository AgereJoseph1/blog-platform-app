from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db_session
from app.crud.post import create_post, delete_post, get_post, list_posts, update_post
from app.models.user import User
from app.schemas.post import PostCreate, PostOut, PostUpdate

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=List[PostOut])
async def list_posts_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db_session),
):
    posts = await list_posts(db, skip=skip, limit=limit)
    return posts


@router.get("/{post_id}", response_model=PostOut)
async def get_post_endpoint(post_id: int, db: AsyncSession = Depends(get_db_session)):
    post = await get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post_endpoint(
    post_in: PostCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    post = await create_post(db, title=post_in.title, content=post_in.content, author_id=current_user.id)
    return post


@router.put("/{post_id}", response_model=PostOut)
async def update_post_endpoint(
    post_id: int,
    post_in: PostUpdate,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    post = await get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    updated = await update_post(db, post, title=post_in.title, content=post_in.content)
    return updated


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post_endpoint(
    post_id: int,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    post = await get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    await delete_post(db, post)
    return None
