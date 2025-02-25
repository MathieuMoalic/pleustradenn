from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from backend.database import get_session
from backend.jwt import get_current_user
from backend.models import (
    SessionExercise,
    SessionExerciseCreate,
    SessionExerciseRead,
    SessionExerciseUpdate,
)

router = APIRouter(
    prefix="/api/session-exercises",
    tags=["session-exercises"],
    dependencies=[Depends(get_current_user)],
)


@router.post(
    "", response_model=SessionExerciseRead, operation_id="sessionExerciseCreate"
)
def create_session_exercise_endpoint(
    session_exercise_data: SessionExerciseCreate,
    session: Session = Depends(get_session),
):
    """
    Create a new session exercise.
    """
    new_session_exercise = SessionExercise(
        **session_exercise_data.model_dump()
    )  # Convert Pydantic model to dict
    session.add(new_session_exercise)
    session.commit()
    session.refresh(new_session_exercise)
    return new_session_exercise


@router.get(
    "", response_model=list[SessionExerciseRead], operation_id="sessionExerciseReadAll"
)
def read_session_exercises_endpoint(session: Session = Depends(get_session)):
    """
    Read all session exercises.
    """
    return session.exec(select(SessionExercise)).all()


@router.put(
    "/{session_exercise_id}",
    response_model=SessionExerciseRead,
    operation_id="sessionExerciseUpdate",
)
def update_session_exercise_endpoint(
    session_exercise_id: int,
    update_data: SessionExerciseUpdate,
    session: Session = Depends(get_session),
):
    """
    Update an existing session exercise by ID.
    """
    session_exercise = session.get(SessionExercise, session_exercise_id)
    if not session_exercise:
        raise ValueError("Session exercise not found.")

    update_data = update_data.model_dump(
        exclude_unset=True
    )  # Ignore unset fields for partial update

    for key, value in update_data.items():
        setattr(session_exercise, key, value)

    session.add(session_exercise)
    session.commit()
    session.refresh(session_exercise)
    return session_exercise


@router.delete(
    "/{session_exercise_id}",
    response_model=SessionExerciseRead,
    operation_id="sessionExerciseDelete",
)
def delete_session_exercise_endpoint(
    session_exercise_id: int, session: Session = Depends(get_session)
):
    """
    Delete a session exercise by ID.
    """
    session_exercise = session.get(SessionExercise, session_exercise_id)
    if not session_exercise:
        raise ValueError("Session exercise not found.")

    session.delete(session_exercise)
    session.commit()
    return session_exercise
