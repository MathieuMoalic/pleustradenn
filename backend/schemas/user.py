from typing import Optional

from pydantic import BaseModel, ConfigDict


# Shared properties
class UserBase(BaseModel):
    username: str


# Properties to receive via API on creation
class UserCreate(BaseModel):
    username: str
    password: str


# Properties to receive via API on update
class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None


# Properties to return via API
class UserRead(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
