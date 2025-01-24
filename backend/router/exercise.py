from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.crud.exercise import (
    create_exercise,
    delete_exercise,
    read_exercises,
    update_exercise,
)
from backend.database import get_session
from backend.jwt import get_current_user
from backend.schemas.exercise import ExerciseCreate, ExerciseRead, ExerciseUpdate

router = APIRouter(
    prefix="/api/exercises",
    tags=["exercises"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=ExerciseRead, operation_id="exerciseCreate")
def create_exercise_endpoint(
    exercise_data: ExerciseCreate, session: Session = Depends(get_session)
):
    """
    Create a new exercise.
    """
    exercise = create_exercise(session, exercise_data.model_dump())
    return exercise


@router.get("", response_model=List[ExerciseRead], operation_id="exerciseReadAll")
def read_exercises_endpoint(session: Session = Depends(get_session)):
    """
    Read all exercises.
    """
    exercises = read_exercises(session)
    return exercises


@router.put("/{exercise_id}", response_model=ExerciseRead, operation_id="exerciseUpdate")
def update_exercise_endpoint(
    exercise_id: int, update_data: ExerciseUpdate, session: Session = Depends(get_session)
):
    """
    Update an existing exercise by ID.
    """
    exercise = update_exercise(
        session, exercise_id, update_data.model_dump(exclude_unset=True)
    )
    return exercise


@router.delete("/{exercise_id}", response_model=ExerciseRead, operation_id="exerciseDelete")
def delete_exercise_endpoint(exercise_id: int, session: Session = Depends(get_session)):
    """
    Delete an exercise by ID.
    """
    exercise = delete_exercise(session, exercise_id)
    return exercise
