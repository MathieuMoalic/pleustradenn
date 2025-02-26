from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from backend.database import get_session
from backend.jwt import get_current_user
from backend.models import Exercise, ExerciseCreate, ExerciseRead, ExerciseUpdate

router = APIRouter(
    prefix="/api/exercises",
    tags=["exercises"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=ExerciseRead, operation_id="exerciseCreate")
def create_exercise_endpoint(
    exercise_data: ExerciseCreate, session: Session = Depends(get_session)
):
    existing_exercise = session.exec(
        select(Exercise).where(Exercise.name == exercise_data.name)
    ).first()
    if existing_exercise:
        raise ValueError("Exercise with this name already exists.")

    new_exercise = Exercise(**exercise_data.model_dump())
    session.add(new_exercise)
    session.commit()
    session.refresh(new_exercise)
    return new_exercise


@router.get("", response_model=list[ExerciseRead], operation_id="exerciseReadAll")
def read_exercises_endpoint(session: Session = Depends(get_session)):
    return session.exec(select(Exercise)).all()


@router.get("/{exercise_id}", response_model=ExerciseRead, operation_id="exerciseRead")
def read_exercise_endpoint(exercise_id: int, session: Session = Depends(get_session)):
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise ValueError("Exercise not found.")
    return exercise


@router.put(
    "/{exercise_id}", response_model=ExerciseRead, operation_id="exerciseUpdate"
)
def update_exercise_endpoint(
    exercise_id: int,
    update_data: ExerciseUpdate,
    session: Session = Depends(get_session),
):
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise ValueError("Exercise not found.")

    update_data = update_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(exercise, key, value)

    session.add(exercise)
    session.commit()
    session.refresh(exercise)
    return exercise


@router.delete(
    "/{exercise_id}", response_model=ExerciseRead, operation_id="exerciseDelete"
)
def delete_exercise_endpoint(exercise_id: int, session: Session = Depends(get_session)):
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise ValueError("Exercise not found.")

    session.delete(exercise)
    session.commit()
    return exercise
