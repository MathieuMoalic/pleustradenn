from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session as DBSession
from sqlmodel import select

from backend.database import get_session
from backend.jwt import get_current_user
from backend.models import Session, SessionCreate, SessionRead, SessionUpdate, User

router = APIRouter(
    prefix="/api/sessions",
    tags=["sessions"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=SessionRead, operation_id="sessionCreate")
def create_session_endpoint(
    session_data: SessionCreate,
    db_session: DBSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session = Session(
        user_id=current_user.id,
        date=session_data.date,
        notes=session_data.notes,
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    return session


@router.get("", response_model=list[SessionRead], operation_id="sessionReadAll")
def read_sessions_endpoint(
    db_session: DBSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return db_session.exec(
        select(Session).where(Session.user_id == current_user.id)
    ).all()


@router.get("/{session_id}", response_model=SessionRead, operation_id="sessionRead")
def read_session_endpoint(
    session_id: int,
    db_session: DBSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session = db_session.get(Session, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session


@router.put("/{session_id}", response_model=SessionRead, operation_id="sessionUpdate")
def update_session_endpoint(
    session_id: int,
    update_data: SessionUpdate,
    db_session: DBSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session = db_session.get(Session, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found.")

    update_data = update_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(session, key, value)

    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    return session


@router.delete(
    "/{session_id}", response_model=SessionRead, operation_id="sessionDelete"
)
def delete_session_endpoint(
    session_id: int,
    db_session: DBSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session = db_session.get(Session, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found.")

    db_session.delete(session)
    db_session.commit()
    return session
