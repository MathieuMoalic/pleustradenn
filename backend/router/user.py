from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.crud.user import create_user, delete_user, read_users, update_user
from backend.database import get_session
from backend.jwt import get_current_user
from backend.passlib import hash_password
from backend.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=UserRead, operation_id="userCreate")
def create_user_endpoint(
    user_data: UserCreate, session: Session = Depends(get_session)
):
    """
    Create a new user.
    """
    user_dict = user_data.model_dump()
    user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
    user = create_user(session, user_dict)
    return user


@router.get("", response_model=List[UserRead], operation_id="userReadAll")
def read_users_endpoint(session: Session = Depends(get_session)):
    """
    Read all users.
    """
    users = read_users(session)
    return users


@router.put("/{user_id}", response_model=UserRead, operation_id="userUpdate")
def update_user_endpoint(
    user_id: int, update_data: UserUpdate, session: Session = Depends(get_session)
):
    """
    Update an existing user by ID.
    """
    user = update_user(session, user_id, update_data.model_dump(exclude_unset=True))
    return user


@router.delete("/{user_id}", response_model=UserRead, operation_id="userDelete")
def delete_user_endpoint(user_id: int, session: Session = Depends(get_session)):
    """
    Delete a user by ID.
    """
    user = delete_user(session, user_id)
    return user
