from datetime import datetime

from pydantic import BaseModel, constr


class PostBase(BaseModel):
    title: constr(min_length=1, max_length=255)
    content: constr(min_length=1)


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: constr(min_length=1, max_length=255) | None = None
    content: constr(min_length=1) | None = None


class PostOut(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
