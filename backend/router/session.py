from fastapi import APIRouter, Depends
from sqlmodel import Session as DBSession
from sqlmodel import select

from backend.database import get_session
from backend.jwt import get_current_user
from backend.models import (
    Session,
    SessionCreate,
    SessionRead,
    SessionUpdate,
)

router = APIRouter(
    prefix="/api/sessions",
    tags=["sessions"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=SessionRead, operation_id="sessionCreate")
def create_session_endpoint(
    session_data: SessionCreate,
    session: DBSession = Depends(get_session),
):
    """
    Create a new session.
    """
    new_session = Session(**session_data.model_dump())  # Convert Pydantic model to dict
    session.add(new_session)
    session.commit()
    session.refresh(new_session)
    return new_session


@router.get("", response_model=list[SessionRead], operation_id="sessionReadAll")
def read_sessions_endpoint(session: DBSession = Depends(get_session)):
    """
    Read all sessions.
    """
    return session.exec(select(Session)).all()


@router.put(
    "/{session_id}",
    response_model=SessionRead,
    operation_id="sessionUpdate",
)
def update_session_endpoint(
    session_id: int,
    update_data: SessionUpdate,
    session: DBSession = Depends(get_session),
):
    """
    Update an existing session by ID.
    """
    db_session = session.get(Session, session_id)
    if not db_session:
        raise ValueError("DBSession not found.")

    update_data = update_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_session, key, value)

    session.add(db_session)
    session.commit()
    session.refresh(db_session)
    return db_session


@router.delete(
    "/{session_id}",
    response_model=SessionRead,
    operation_id="sessionDelete",
)
def delete_session_endpoint(session_id: int, session: DBSession = Depends(get_session)):
    """
    Delete a session by ID.
    """
    db_session = session.get(Session, session_id)
    if not db_session:
        raise ValueError("DBSession not found.")

    session.delete(db_session)
    session.commit()
    return db_session
