from sqlmodel import Session as DBSession
from sqlmodel import SQLModel, create_engine

from backend.env import DATABASE_URL
from backend.models import Exercise, Session, SessionExercise, User  # noqa: F401

engine = create_engine(DATABASE_URL, echo=False)
SQLModel.metadata.create_all(engine)


def get_session():
    with DBSession(engine) as session:
        yield session
