from typing import Any, Sequence

from sqlmodel import Session, select

from backend.models import Exercise


def read_exercises(session: Session) -> Sequence[Exercise]:
    """Return all exercises."""
    return session.exec(select(Exercise)).all()


def create_exercise(session: Session, data: dict[str, Any]) -> Exercise:
    """Create a new exercise."""
    if "name" not in data or not data["name"]:
        raise ValueError("Exercise name is required.")

    # Check for duplicate name
    existing_exercise = session.exec(
        select(Exercise).where(Exercise.name == data["name"])
    ).first()
    if existing_exercise:
        raise ValueError("Exercise with this name already exists.")

    exercise = Exercise(**data)
    session.add(exercise)
    session.commit()
    session.refresh(exercise)
    return exercise


def update_exercise(
    session: Session, exercise_id: int, data: dict[str, Any]
) -> Exercise:
    """Update an existing exercise."""
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise ValueError("Exercise not found.")

    for key, value in data.items():
        setattr(exercise, key, value)

    session.add(exercise)
    session.commit()
    session.refresh(exercise)
    return exercise


def delete_exercise(session: Session, exercise_id: int) -> Exercise:
    """Delete an exercise by ID."""
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise ValueError("Exercise not found.")

    session.delete(exercise)
    session.commit()
    return exercise  # Return the deleted exercise
