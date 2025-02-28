from os import environ

PROD = environ.get("PROD", False)
if not PROD:
    DATABASE_URL = "sqlite:///./data/db1.sqlite"
    ADMIN_USERNAME = "a"
    ADMIN_PASSWORD = "a"

else:
    _DATABASE_URL = environ.get("DATABASE_URL")
    _ADMIN_USERNAME = environ.get("ADMIN_USERNAME")
    _ADMIN_PASSWORD = environ.get("ADMIN_PASSWORD")
    if not _ADMIN_USERNAME:
        raise ValueError("ADMIN_USERNAME must be set.")
    if not _ADMIN_PASSWORD:
        raise ValueError("ADMIN_PASSWORD must be set.")
    if not _DATABASE_URL:
        raise ValueError("DATABASE_URL must be set.")
    DATABASE_URL = str(_DATABASE_URL)
    ADMIN_USERNAME = str(_ADMIN_USERNAME)
    ADMIN_PASSWORD = str(_ADMIN_PASSWORD)

SECRET_KEY = ADMIN_PASSWORD
