from typing import Optional

from pydantic import BaseModel


class ItemCreate(BaseModel):
    """
    Schema for creating a new Item.
    """

    name: str
    category_id: int
    notes: str
    quantity: Optional[float] = None
    unit: str


class ItemUpdate(BaseModel):
    """
    Schema for updating an existing Item.
    """

    name: Optional[str] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None


class ItemRead(BaseModel):
    """
    Schema for reading an Item (response).
    """

    id: int
    name: str
    category_id: int
    is_active: bool
    notes: str
    quantity: Optional[float]
    unit: str
