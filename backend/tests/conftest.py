import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel

from backend.database import engine, get_session
from backend.main import app
from backend.models import User
from backend.passlib import hash_password


@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def session():
    with Session(engine) as session:
        yield session


@pytest.fixture(scope="function")
def test_user(session):
    user = User(id=1, username="a", hashed_password=hash_password("a"))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(scope="function")
def client(session, test_user):
    def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session

    client = TestClient(app)

    response = client.post("/token", data={"username": "a", "password": "a"})
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]

    client.headers.update({"Authorization": f"Bearer {token}"})

    return client
