import logging
import os
from pathlib import Path

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles

from backend.init_db_data import init_db_data
from backend.jwt import jwt_login
from backend.router.exercise import router as exercise_router
from backend.router.session import router as session_router
from backend.router.session_exercise import router as session_exercise_router
from backend.router.user import router as user_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("database")


app = FastAPI()


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return jwt_login(form_data.username, form_data.password)


app.include_router(exercise_router)
app.include_router(user_router)
app.include_router(session_router)
app.include_router(session_exercise_router)


# handle all ValueErrors
@app.exception_handler(ValueError)
async def value_error_exception_handler(_: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )


# This must be the last route
static_path = os.path.dirname(os.path.abspath(__file__)) + "/static"
if Path(static_path).exists():
    app.mount(
        "/",
        StaticFiles(directory=static_path, html=True),
        name="static",
    )

init_db_data()
