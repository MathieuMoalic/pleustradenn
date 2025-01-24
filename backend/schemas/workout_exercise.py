from typing import Optional
from pydantic import BaseModel, ConfigDict


# Shared properties
class WorkoutExerciseBase(BaseModel):
    workout_id: int
    exercise_id: int
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None  # kg or lbs
    rest_time: Optional[int] = None  # seconds


# Properties to receive via API on creation
class WorkoutExerciseCreate(WorkoutExerciseBase):
    pass


# Properties to receive via API on update
class WorkoutExerciseUpdate(BaseModel):
    workout_id: Optional[int] = None
    exercise_id: Optional[int] = None
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    rest_time: Optional[int] = None


# Properties to return via API
class WorkoutExerciseRead(WorkoutExerciseBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
