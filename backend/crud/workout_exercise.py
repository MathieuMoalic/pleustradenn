from typing import Any, Sequence

from sqlmodel import Session, select

from backend.models import WorkoutExercise


def read_workout_exercises(session: Session) -> Sequence[WorkoutExercise]:
    """Return all workout exercises."""
    return session.exec(select(WorkoutExercise)).all()


def create_workout_exercise(session: Session, data: dict[str, Any]) -> WorkoutExercise:
    """Create a new workout exercise."""
    if "workout_id" not in data or not data["workout_id"]:
        raise ValueError("Workout ID is required.")
    if "exercise_id" not in data or not data["exercise_id"]:
        raise ValueError("Exercise ID is required.")

    workout_exercise = WorkoutExercise(**data)
    session.add(workout_exercise)
    session.commit()
    session.refresh(workout_exercise)
    return workout_exercise


def update_workout_exercise(
    session: Session, workout_exercise_id: int, data: dict[str, Any]
) -> WorkoutExercise:
    """Update an existing workout exercise."""
    workout_exercise = session.get(WorkoutExercise, workout_exercise_id)
    if not workout_exercise:
        raise ValueError("Workout exercise not found.")

    for key, value in data.items():
        setattr(workout_exercise, key, value)

    session.add(workout_exercise)
    session.commit()
    session.refresh(workout_exercise)
    return workout_exercise


def delete_workout_exercise(
    session: Session, workout_exercise_id: int
) -> WorkoutExercise:
    """Delete a workout exercise by ID."""
    workout_exercise = session.get(WorkoutExercise, workout_exercise_id)
    if not workout_exercise:
        raise ValueError("Workout exercise not found.")
    session.delete(workout_exercise)
    session.commit()
    return workout_exercise
