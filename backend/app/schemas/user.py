from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, constr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: constr(min_length=8)


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
