from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.crud.categories import (
    create_category,
    delete_category,
    read_categories,
    update_category,
)
from backend.database import get_session
from backend.jwt import get_current_user
from backend.schemas.categories import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(
    prefix="/api/categories",
    tags=["categories"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=CategoryRead, operation_id="categoryCreate")
def create_category_endpoint(
    category_data: CategoryCreate, session: Session = Depends(get_session)
):
    """
    Create a new category.
    """
    category = create_category(session, category_data.model_dump())
    return category


@router.get("", response_model=List[CategoryRead], operation_id="categoryreadAll")
def read_categories_endpoint(session: Session = Depends(get_session)):
    """
    Read all categories.
    """
    categories = read_categories(session)
    return categories


@router.put(
    "/{category_id}", response_model=CategoryRead, operation_id="categoryUpdate"
)
def update_category_endpoint(
    category_id: int,
    update_data: CategoryUpdate,
    session: Session = Depends(get_session),
):
    """
    Update an existing category by ID.
    """
    category = update_category(
        session, category_id, update_data.model_dump(exclude_unset=True)
    )
    return category


@router.delete(
    "/{category_id}", response_model=CategoryRead, operation_id="categoryDelete"
)
def delete_category_endpoint(category_id: int, session: Session = Depends(get_session)):
    """
    Delete an category by ID.
    """
    category = delete_category(session, category_id)
    return category
