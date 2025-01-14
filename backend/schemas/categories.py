from typing import Optional

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    """
    Schema for creating a new Category.
    """

    name: str


class CategoryUpdate(BaseModel):
    """
    Schema for updating an existing Category.
    """

    name: Optional[str] = None


class CategoryRead(BaseModel):
    """
    Schema for reading a Category (response).
    """

    id: int
    name: str
