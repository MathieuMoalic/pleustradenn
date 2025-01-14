# test_categories.py
import os

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from backend.database import get_session
from backend.main import app

# 1) Create an in-memory SQLite engine for testing
# Remove the previous test DB if it exists
os.remove("./test_1.db") if os.path.exists("./test_1.db") else None
test_engine = create_engine(
    "sqlite:///./test_1.db",
    echo=False,
)


# 2) Create a fresh test DB schema before running tests
@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    SQLModel.metadata.create_all(test_engine)
    yield
    # (Optional) Drop tables or close resources after tests if needed


# 3) Override the `get_session` dependency to use the test DB
@pytest.fixture
def session():
    """
    Creates a new SQLModel Session pointing to the test engine.
    """
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def client(session):
    """
    Override FastAPI's dependency with our test session.
    Return a TestClient for making requests to our FastAPI app.
    """

    def _get_test_session():
        return session

    app.dependency_overrides[get_session] = _get_test_session
    client = TestClient(app)
    return client


# 4) Start writing tests
def test_create_category(client):
    """
    Test creating a new category.
    """
    response = client.post("/categories", json={"name": "Vegetables"})
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Vegetables"


def test_read_all_categories_empty(client):
    """
    Test reading all categories when there's exactly 1 in DB
    from the previous test.
    """
    # We expect from previous test there is exactly 1 category
    response = client.get("/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Vegetables"


def test_update_category(client, session):
    """
    Test updating a category by ID.
    """
    # First, let's see which category ID we have
    # We can read from DB or from the existing route:
    list_resp = client.get("/categories")
    categories = list_resp.json()
    cat_id = (
        categories[0]["id"] if "id" in categories[0] else 1
    )  # or depends on your schema

    # Now update the category
    response = client.put(f"/categories/{cat_id}", json={"name": "Fruits"})
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Fruits"


def test_delete_category(client):
    """
    Test deleting a category by ID.
    """
    # Grab current categories
    list_resp = client.get("/categories")
    categories = list_resp.json()
    cat_id = categories[0]["id"]

    # Delete the category
    response = client.delete(f"/categories/{cat_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Fruits"

    # Verify it's actually gone
    final_list_resp = client.get("/categories")
    final_categories = final_list_resp.json()
    assert len(final_categories) == 0
