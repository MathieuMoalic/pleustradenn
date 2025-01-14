from typing import Any

from sqlmodel import Session, select

from backend.models import User
from backend.passlib import hash_password


def create_user(session: Session, data: dict[str, Any]) -> User:
    existing_user = session.exec(
        select(User).where(User.username == data["username"])
    ).first()
    if existing_user:
        raise ValueError("Username already taken.")

    data["hashed_password"] = hash_password(data["password"])
    del data["password"]

    user = User(**data)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
