from typing import Any, Sequence

from sqlmodel import Session, select

from backend.models import Workout


def read_workouts(session: Session) -> Sequence[Workout]:
    """Return all workouts."""
    return session.exec(select(Workout)).all()


def read_workout(session: Session, workout_id: int) -> Workout:
    """Return a workout by ID."""
    workout = session.get(Workout, workout_id)
    if not workout:
        raise ValueError("Workout not found.")
    return workout


def create_workout(session: Session, data: dict[str, Any]) -> Workout:
    """Create a new workout."""
    if "user_id" not in data or not data["user_id"]:
        raise ValueError("User ID is required.")

    workout = Workout(**data)
    session.add(workout)
    session.commit()
    session.refresh(workout)
    return workout


def update_workout(session: Session, workout_id: int, data: dict[str, Any]) -> Workout:
    """Update an existing workout."""
    workout = session.get(Workout, workout_id)
    if not workout:
        raise ValueError("Workout not found.")

    for key, value in data.items():
        setattr(workout, key, value)

    session.add(workout)
    session.commit()
    session.refresh(workout)
    return workout


def delete_workout(session: Session, workout_id: int) -> Workout:
    """Delete a workout by ID."""
    workout = session.get(Workout, workout_id)
    if not workout:
        raise ValueError("Workout not found.")
    session.delete(workout)
    session.commit()
    return workout
