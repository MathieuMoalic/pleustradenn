from typing import Any, Sequence

from sqlmodel import Session, select

from backend.models import Category, Item


def create_item(session: Session, data: dict[str, Any]) -> Item:
    # Check if the category exists
    category_id = data.get("category_id")
    if category_id:
        category = session.get(Category, category_id)
        if not category:
            raise ValueError(f"Category with ID '{category_id}' does not exist.")

    # Check if an item with the same name exists
    existing_item = session.exec(select(Item).where(Item.name == data["name"])).first()
    if existing_item:
        raise ValueError("Item with this name already exists.")

    # Create and add the item
    item = Item(**data)
    item.is_active = True
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def read_items(session: Session) -> Sequence[Item]:
    items = session.exec(select(Item)).all()
    return items


def read_item(session: Session, item_id: int) -> Item:
    item = session.get(Item, item_id)
    if not item:
        raise ValueError("Item not found.")
    return item


def update_item(session: Session, item_id: int, update_data: dict[str, Any]) -> Item:
    item = session.get(Item, item_id)
    if not item:
        raise ValueError("Item not found.")

    # Update fields
    for key, value in update_data.items():
        setattr(item, key, value)

    # Ensure the category exists if updated
    if "category_id" in update_data and update_data["category_id"]:
        category = session.get(Category, update_data["category_id"])
        if not category:
            raise ValueError(
                f"Category with ID '{update_data['category_id']}' does not exist."
            )

    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def delete_item(session: Session, item_id: int) -> Item:
    item = session.get(Item, item_id)
    if not item:
        raise ValueError("Item not found.")
    session.delete(item)
    session.commit()
    return item
