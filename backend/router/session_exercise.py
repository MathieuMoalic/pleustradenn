from fastapi import APIRouter, Depends
from sqlmodel import Session, desc, select

from backend.database import get_session
from backend.jwt import get_current_user
from backend.models import (
    Exercise,
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


def _to_session_exercise_read(
    se: SessionExercise, session: Session
) -> SessionExerciseRead:
    exercise = se.exercise or session.get(Exercise, se.exercise_id)
    return SessionExerciseRead(
        id=se.id,
        session_id=se.session_id,
        exercise_id=se.exercise_id,
        sets=se.sets,
        reps=se.reps,
        weight=se.weight,
        rest_seconds=se.rest_seconds,
        count=se.count,
        exercise_name=exercise.name,
        completed=se.completed,
        created_at=se.created_at,
        success=se.success,
        notes=se.notes,
    )


@router.post(
    "", response_model=SessionExerciseRead, operation_id="sessionExerciseCreate"
)
def create_session_exercise_endpoint(
    data: SessionExerciseCreate, session: Session = Depends(get_session)
):
    if not session.get(Exercise, data.exercise_id):
        raise ValueError("Exercise not found.")
    se = SessionExercise(**data.model_dump())
    session.add(se)
    session.commit()
    session.refresh(se)
    return _to_session_exercise_read(se, session)


@router.get(
    "", response_model=list[SessionExerciseRead], operation_id="sessionExerciseReadAll"
)
def read_session_exercises_endpoint(session: Session = Depends(get_session)):
    session_exercises = session.exec(select(SessionExercise)).all()
    return [_to_session_exercise_read(se, session) for se in session_exercises]


@router.get(
    "/{id}",
    response_model=SessionExerciseRead,
    operation_id="sessionExerciseReadDetailed",
)
def read_session_exercise_endpoint(id: int, session: Session = Depends(get_session)):
    se = session.get(SessionExercise, id)
    if not se:
        raise ValueError("Session exercise not found.")
    return _to_session_exercise_read(se, session)


# return the latest session exercise with the given exercise_id
@router.get(
    "/exercise/{exercise_id}",
    response_model=SessionExerciseRead | None,
    operation_id="sessionExerciseReadLatestByExercise",
)
def read_session_exercise_by_exercise_endpoint(
    exercise_id: int, session: Session = Depends(get_session)
):
    se = session.exec(
        select(SessionExercise)
        .where(SessionExercise.exercise_id == exercise_id)
        .order_by(desc(SessionExercise.created_at))
    ).first()
    if not se:
        return None
    return _to_session_exercise_read(se, session)


@router.put(
    "/{id}", response_model=SessionExerciseRead, operation_id="sessionExerciseUpdate"
)
def update_session_exercise_endpoint(
    id: int, data: SessionExerciseUpdate, session: Session = Depends(get_session)
):
    se = session.get(SessionExercise, id)
    if not se:
        raise ValueError("Session exercise not found.")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(se, k, v)
    session.add(se)
    session.commit()
    session.refresh(se)
    return _to_session_exercise_read(se, session)


@router.delete(
    "/{id}", response_model=SessionExerciseRead, operation_id="sessionExerciseDelete"
)
def delete_session_exercise_endpoint(id: int, session: Session = Depends(get_session)):
    se = session.get(SessionExercise, id)
    if not se:
        raise ValueError("Session exercise not found.")
    read_model = _to_session_exercise_read(se, session)
    session.delete(se)
    session.commit()
    return read_model
