from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.crud.workout_exercise import (
    create_workout_exercise,
    delete_workout_exercise,
    read_workout_exercises,
    update_workout_exercise,
)
from backend.database import get_session
from backend.jwt import get_current_user
from backend.schemas.workout_exercise import WorkoutExerciseCreate, WorkoutExerciseRead, WorkoutExerciseUpdate

router = APIRouter(
    prefix="/api/workout-exercises",
    tags=["workout-exercises"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=WorkoutExerciseRead, operation_id="workoutExerciseCreate")
def create_workout_exercise_endpoint(
    workout_exercise_data: WorkoutExerciseCreate, session: Session = Depends(get_session)
):
    """
    Create a new workout exercise.
    """
    workout_exercise = create_workout_exercise(
        session, workout_exercise_data.model_dump()
    )
    return workout_exercise


@router.get("", response_model=List[WorkoutExerciseRead], operation_id="workoutExerciseReadAll")
def read_workout_exercises_endpoint(session: Session = Depends(get_session)):
    """
    Read all workout exercises.
    """
    workout_exercises = read_workout_exercises(session)
    return workout_exercises


@router.put(
    "/{workout_exercise_id}",
    response_model=WorkoutExerciseRead,
    operation_id="workoutExerciseUpdate",
)
def update_workout_exercise_endpoint(
    workout_exercise_id: int,
    update_data: WorkoutExerciseUpdate,
    session: Session = Depends(get_session),
):
    """
    Update an existing workout exercise by ID.
    """
    workout_exercise = update_workout_exercise(
        session, workout_exercise_id, update_data.model_dump(exclude_unset=True)
    )
    return workout_exercise


@router.delete(
    "/{workout_exercise_id}",
    response_model=WorkoutExerciseRead,
    operation_id="workoutExerciseDelete",
)
def delete_workout_exercise_endpoint(
    workout_exercise_id: int, session: Session = Depends(get_session)
):
    """
    Delete a workout exercise by ID.
    """
    workout_exercise = delete_workout_exercise(session, workout_exercise_id)
    return workout_exercise
