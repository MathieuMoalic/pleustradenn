from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.crud.items import (
    create_item,
    delete_item,
    read_item,
    read_items,
    update_item,
)
from backend.database import get_session
from backend.jwt import get_current_user
from backend.schemas.items import (
    ItemCreate,
    ItemRead,
    ItemUpdate,
)

router = APIRouter(
    prefix="/api/items",
    tags=["items"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=ItemRead, operation_id="itemCreate")
def create_item_endpoint(
    item_data: ItemCreate, session: Session = Depends(get_session)
):
    """
    Create a new item.
    """
    item = create_item(session, item_data.model_dump())
    return item


@router.get("", response_model=List[ItemRead], operation_id="itemReadAll")
def read_items_endpoint(session: Session = Depends(get_session)):
    """
    Read all items.
    """
    items = read_items(session)
    return items


@router.get("/{item_id}", response_model=ItemRead, operation_id="itemRead")
def read_item_endpoint(item_id: int, session: Session = Depends(get_session)):
    """
    Read a single item by ID.
    """
    item = read_item(session, item_id)
    return item


@router.put("/{item_id}", response_model=ItemRead, operation_id="itemUpdate")
def update_item_endpoint(
    item_id: int, update_data: ItemUpdate, session: Session = Depends(get_session)
):
    """
    Update an existing item by ID.
    """
    item = update_item(session, item_id, update_data.model_dump(exclude_unset=True))
    return item


@router.delete("/{item_id}", response_model=ItemRead, operation_id="itemDelete")
def delete_item_endpoint(item_id: int, session: Session = Depends(get_session)):
    """
    Delete an item by ID.
    """
    item = delete_item(session, item_id)
    return item
