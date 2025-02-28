from fastapi import APIRouter, Depends
from sqlmodel import Session, select

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


@router.post(
    "", response_model=SessionExerciseRead, operation_id="sessionExerciseCreate"
)
def create_session_exercise_endpoint(
    data: SessionExerciseCreate,
    session: Session = Depends(get_session),
):
    exercise = session.get(Exercise, data.exercise_id)
    if not exercise:
        raise ValueError("Exercise not found.")
    new_session_exercise = SessionExercise(**data.model_dump())
    session.add(new_session_exercise)
    session.commit()
    session.refresh(new_session_exercise)
    return SessionExerciseRead(
        id=new_session_exercise.id,
        session_id=new_session_exercise.session_id,
        exercise_id=new_session_exercise.exercise_id,
        sets=new_session_exercise.sets,
        reps=new_session_exercise.reps,
        weight=new_session_exercise.weight,
        rest_seconds=new_session_exercise.rest_seconds,
        count=new_session_exercise.count,
        exercise_name=exercise.name,
    )


@router.get("", response_model=list[SessionExerciseRead])
def read_session_exercises_endpoint(session: Session = Depends(get_session)):
    session_exercises = session.exec(select(SessionExercise)).all()
    return [
        SessionExerciseRead(
            id=se.id,
            session_id=se.session_id,
            exercise_id=se.exercise_id,
            sets=se.sets,
            reps=se.reps,
            weight=se.weight,
            rest_seconds=se.rest_seconds,
            count=se.count,
            exercise_name=se.exercise.name,
        )
        for se in session_exercises
    ]


@router.get("/{id}", response_model=SessionExerciseRead)
def read_session_exercise_endpoint(id: int, session: Session = Depends(get_session)):
    session_exercise = session.get(SessionExercise, id)
    if not session_exercise:
        raise ValueError("Session exercise not found.")
    return SessionExerciseRead(
        id=session_exercise.id,
        session_id=session_exercise.session_id,
        exercise_id=session_exercise.exercise_id,
        sets=session_exercise.sets,
        reps=session_exercise.reps,
        weight=session_exercise.weight,
        rest_seconds=session_exercise.rest_seconds,
        count=session_exercise.count,
        exercise_name=session_exercise.exercise.name,
    )


@router.put(
    "/{id}", response_model=SessionExerciseRead, operation_id="sessionExerciseUpdate"
)
def update_session_exercise_endpoint(
    id: int,
    data: SessionExerciseUpdate,
    session: Session = Depends(get_session),
):
    session_exercise = session.get(SessionExercise, id)
    if not session_exercise:
        raise ValueError("Session exercise not found.")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(session_exercise, key, value)
    session.add(session_exercise)
    session.commit()
    session.refresh(session_exercise)
    exercise = session_exercise.exercise or session.get(
        Exercise, session_exercise.exercise_id
    )
    return SessionExerciseRead(
        id=session_exercise.id,
        session_id=session_exercise.session_id,
        exercise_id=session_exercise.exercise_id,
        sets=session_exercise.sets,
        reps=session_exercise.reps,
        weight=session_exercise.weight,
        rest_seconds=session_exercise.rest_seconds,
        count=session_exercise.count,
        exercise_name=exercise.name,
    )


@router.delete(
    "/{id}", response_model=SessionExerciseRead, operation_id="sessionExerciseDelete"
)
def delete_session_exercise_endpoint(id: int, session: Session = Depends(get_session)):
    session_exercise = session.get(SessionExercise, id)
    if not session_exercise:
        raise ValueError("Session exercise not found.")
    exercise = session_exercise.exercise or session.get(
        Exercise, session_exercise.exercise_id
    )
    session.delete(session_exercise)
    session.commit()
    return SessionExerciseRead(
        id=session_exercise.id,
        session_id=session_exercise.session_id,
        exercise_id=session_exercise.exercise_id,
        sets=session_exercise.sets,
        reps=session_exercise.reps,
        weight=session_exercise.weight,
        rest_seconds=session_exercise.rest_seconds,
        count=session_exercise.count,
        exercise_name=exercise.name,
    )
