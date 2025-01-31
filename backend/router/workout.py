from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.crud.workout import (
    create_workout,
    delete_workout,
    read_workouts,
    update_workout,
)
from backend.database import get_session
from backend.jwt import get_current_user
from backend.schemas.workout import WorkoutCreate, WorkoutRead, WorkoutUpdate

router = APIRouter(
    prefix="/api/workouts",
    tags=["workouts"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=WorkoutRead, operation_id="workoutCreate")
def create_workout_endpoint(
    workout_data: WorkoutCreate, session: Session = Depends(get_session)
):
    """
    Create a new workout.
    """
    workout = create_workout(session, workout_data.model_dump())
    return workout


@router.get("", response_model=List[WorkoutRead], operation_id="workoutReadAll")
def read_workouts_endpoint(session: Session = Depends(get_session)):
    """
    Read all workouts.
    """
    workouts = read_workouts(session)
    return workouts


@router.put("/{workout_id}", response_model=WorkoutRead, operation_id="workoutUpdate")
def update_workout_endpoint(
    workout_id: int, update_data: WorkoutUpdate, session: Session = Depends(get_session)
):
    """
    Update an existing workout by ID.
    """
    workout = update_workout(
        session, workout_id, update_data.model_dump(exclude_unset=True)
    )
    return workout


@router.delete(
    "/{workout_id}", response_model=WorkoutRead, operation_id="workoutDelete"
)
def delete_workout_endpoint(workout_id: int, session: Session = Depends(get_session)):
    """
    Delete a workout by ID.
    """
    workout = delete_workout(session, workout_id)
    return workout
