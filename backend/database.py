from os import environ

from sqlmodel import Session as DBSession
from sqlmodel import SQLModel, create_engine

DATABASE_URL = environ.get("DATABASE_URL", "sqlite:///../data/db1.sqlite")

engine = create_engine(DATABASE_URL, echo=False)
SQLModel.metadata.create_all(engine)


def get_session():
    with DBSession(engine) as session:
        yield session
