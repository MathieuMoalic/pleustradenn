from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from backend.database import get_session
from backend.jwt import get_current_user
from backend.models import User, UserCreate, UserRead, UserUpdate
from backend.passlib import hash_password

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=UserRead, operation_id="userCreate")
def create_user_endpoint(data: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(User).where(User.username == data.username)
    ).first()
    if existing_user:
        raise ValueError("Username already taken.")

    user = User(
        username=data.username,
        hashed_password=hash_password(data.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("", response_model=list[UserRead], operation_id="userReadAll")
def read_users_endpoint(session: Session = Depends(get_session)):
    """
    Read all users.
    """
    return session.exec(select(User)).all()


@router.put("/{user_id}", response_model=UserRead, operation_id="userUpdate")
def update_user_endpoint(
    user_id: int, data: UserUpdate, session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user:
        raise ValueError("User not found.")

    update_data = data.model_dump(
        exclude_unset=True
    )  # Convert Pydantic model to dictionary

    if "password" in update_data:  # Handle password hashing if updated
        update_data["hashed_password"] = hash_password(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(user, key, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.delete("/{user_id}", response_model=UserRead, operation_id="userDelete")
def delete_user_endpoint(user_id: int, session: Session = Depends(get_session)):
    """
    Delete a user by ID.
    """
    user = session.get(User, user_id)
    if not user:
        raise ValueError("User not found.")
    session.delete(user)
    session.commit()
    return user
