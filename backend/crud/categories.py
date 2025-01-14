from typing import Any, Sequence

from sqlmodel import Session, select

from backend.models import Category, Item


def read_categories(session: Session) -> Sequence[Category]:
    """Return all categories."""
    categories = session.exec(select(Category)).all()
    return categories


def create_category(session: Session, data: dict[str, Any]) -> Category:
    """
    Create a new category.
    Raises:
        ValueError: If a category with this name already exists,
                    or if 'name' is missing/invalid in data.
    """
    # Check if "name" is provided
    if "name" not in data or not data["name"]:
        raise ValueError("Category 'name' is required.")

    # Check if category already exists
    existing_category = session.exec(
        select(Category).where(Category.name == data["name"])
    ).first()
    if existing_category:
        raise ValueError("Category already exists.")

    category = Category(**data)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def update_category(
    session: Session, category_id: int, data: dict[str, Any]
) -> Category:
    """
    Update an existing category by ID.
    Raises:
        ValueError: If the category does not exist,
                    if the 'name' is already taken by another category,
                    or if other validation fails.
    """
    # Make sure the category we want to modify exists
    category = session.get(Category, category_id)
    if not category:
        raise ValueError("Category not found.")

    # If user wants to update the name, verify uniqueness
    if "name" in data and data["name"] is not None:
        # If they're not actually changing the name, skip
        if data["name"] != category.name:
            # Check if another category already has this name
            existing_category = session.exec(
                select(Category).where(Category.name == data["name"])
            ).first()
            # Ensure it's not the same category
            if existing_category and existing_category.id != category_id:
                raise ValueError("Another category already has this name.")

    # Update fields
    for key, value in data.items():
        setattr(category, key, value)

    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def delete_category(session: Session, category_id: int) -> Category:
    """
    Delete a category by ID.
    Re-assign items belonging to that category to category_id=1 by default (if that is your 'Uncategorized' category).
    Raises:
        ValueError: If the category does not exist.
    """
    category = session.get(Category, category_id)
    if not category:
        raise ValueError("Category not found.")

    # Find all items referencing this category
    items = session.exec(select(Item).where(Item.category_id == category_id)).all()
    if items:
        # You might also check if category 1 exists or handle that scenario
        for item in items:
            item.category_id = 1
            session.add(item)
        # Commit once after re-assigning all items
        session.commit()

    session.delete(category)
    session.commit()
    return category
