from typing import List, Optional
import datetime
from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    workouts: List["Workout"] = Relationship(back_populates="user")


class Exercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None)  # e.g., strength, cardio
    muscle_group: Optional[str] = Field(default=None)
    equipment: Optional[str] = Field(default=None)


class Workout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    date: Optional[datetime.date] = Field(default=None)  # ISO format date
    notes: Optional[str] = Field(default=None)

    user: Optional["User"] = Relationship(back_populates="workouts")
    exercises: List["WorkoutExercise"] = Relationship(back_populates="workout")


class WorkoutExercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workout_id: int = Field(foreign_key="workout.id")
    exercise_id: int = Field(foreign_key="exercise.id")
    sets: Optional[int] = Field(default=None)
    reps: Optional[int] = Field(default=None)
    weight: Optional[float] = Field(default=None)  # kg or lbs
    rest_time: Optional[int] = Field(default=None)  # seconds

    workout: Optional["Workout"] = Relationship(back_populates="exercises")
    exercise: Optional["Exercise"] = Relationship()

# Back-populate relationships
User.workouts = Relationship(back_populates="user", sa_relationship_kwargs={"cascade": "all, delete"})
Workout.exercises = Relationship(back_populates="workout", sa_relationship_kwargs={"cascade": "all, delete"})
