from typing import Any, Sequence

from sqlmodel import Session, select

from backend.models import User
from backend.passlib import hash_password


def create_user(session: Session, data: dict[str, Any]) -> User:
    existing_user = session.exec(
        select(User).where(User.username == data["username"])
    ).first()
    if existing_user:
        raise ValueError("Username already taken.")
    data["hashed_password"] = hash_password(data.pop("password"))
    user = User(**data)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def read_users(session: Session) -> Sequence[User]:
    """Return all users."""
    return session.exec(select(User)).all()


def update_user(session: Session, user_id: int, data: dict[str, Any]) -> User:
    """Update an existing user."""
    user = session.get(User, user_id)
    if not user:
        raise ValueError("User not found.")

    for key, value in data.items():
        setattr(user, key, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def delete_user(session: Session, user_id: int) -> User:
    """Delete a user by ID."""
    user = session.get(User, user_id)
    if not user:
        raise ValueError("User not found.")
    session.delete(user)
    session.commit()
    return user
