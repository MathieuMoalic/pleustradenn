from os import environ

from sqlmodel import Session, SQLModel, create_engine, select

from backend.crud.categories import create_category
from backend.crud.items import create_item
from backend.crud.users import create_user
from backend.models import Category, Item, User

DATABASE_URL = environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL, echo=False)  # Disable SQL debug logs
SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency used to provide a DB session in FastAPI endpoints.
    """
    with Session(engine) as session:
        yield session


with Session(engine) as session:
    if len(session.exec(select(User)).all()) == 0:
        admin_username = environ.get("ADMIN_USERNAME")
        admin_password = environ.get("ADMIN_PASSWORD")
        if admin_username is None or admin_password is None:
            raise ValueError(
                "ADMIN_USERNAME and ADMIN_PASSWORD must be set as environment variables to create the database."
            )
        create_user(session, {"username": admin_username, "password": admin_password})

    if len(session.exec(select(Category)).all()) == 0:
        create_category(session, {"name": "Other"})
        create_category(session, {"name": "Fruits"})
        create_category(session, {"name": "Vegetables"})
        create_category(session, {"name": "Bakery"})
        create_category(session, {"name": "Drinks"})
        create_category(session, {"name": "Alcohol"})
        create_category(session, {"name": "Non-food"})

    if len(session.exec(select(Item)).all()) == 0:
        create_item(session, {"name": "Apple", "category_id": 2})
        create_item(session, {"name": "Banana", "category_id": 2})
        create_item(session, {"name": "Carrot", "category_id": 3})
        create_item(session, {"name": "Potato", "category_id": 3})
        create_item(session, {"name": "Bread", "category_id": 4})
        create_item(session, {"name": "Milk", "category_id": 5})
        create_item(session, {"name": "Beer", "category_id": 6})
        create_item(session, {"name": "Soap", "category_id": 7})
        create_item(session, {"name": "Orange", "category_id": 2})
        create_item(session, {"name": "Pear", "category_id": 2})
        create_item(session, {"name": "Cucumber", "category_id": 3})
        create_item(session, {"name": "Tomato", "category_id": 3})
        create_item(session, {"name": "White wine", "category_id": 6})
        create_item(session, {"name": "Red wine", "category_id": 6})
        create_item(session, {"name": "Toilet paper", "category_id": 7})
        create_item(session, {"name": "Shampoo", "category_id": 7})
        create_item(session, {"name": "Conditioner", "category_id": 7})
        create_item(session, {"name": "Tofu", "category_id": 3})
        create_item(session, {"name": "Soy milk", "category_id": 5})
        create_item(session, {"name": "Vegan cheese", "category_id": 5})
        create_item(session, {"name": "Vegan sausage", "category_id": 5})
        create_item(session, {"name": "Vegan burger", "category_id": 5})
