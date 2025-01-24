import os

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from backend.database import get_session
from backend.main import app
from backend.models import User
from backend.passlib import hash_password

DB_PATH = "./test.db"


@pytest.fixture(name="session")
def session_fixture():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    engine = create_engine(f"sqlite:///{DB_PATH}")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    # Override the DB session dependency
    def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session

    return TestClient(app)


@pytest.fixture
def test_user(session):
    # Create user "a" with password "a" in the DB (hashed)
    user = User(
        username="a",
        hashed_password=hash_password("a"),  # must match your passlib approach
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def token(client, test_user):
    # Call /token to get a real JWT
    resp = client.post("/token", data={"username": "a", "password": "a"})
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


@pytest.fixture
def auth_client(client, token):
    """
    Fixture that provides a TestClient with the Authorization header included.
    """
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
