from os import environ

PROD = environ.get("PROD", False)
if not PROD:
    DATABASE_URL = "sqlite:///./data/db1.sqlite"
    ADMIN_USERNAME = "a"
    ADMIN_PASSWORD = "a"

else:
    DATABASE_URL = environ.get("DATABASE_URL")
    ADMIN_USERNAME = environ.get("ADMIN_USERNAME")
    ADMIN_PASSWORD = environ.get("ADMIN_PASSWORD")
    if not ADMIN_USERNAME:
        raise ValueError("ADMIN_USERNAME must be set.")
    if not ADMIN_PASSWORD:
        raise ValueError("ADMIN_PASSWORD must be set.")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL must be set.")

SECRET_KEY = ADMIN_PASSWORD
