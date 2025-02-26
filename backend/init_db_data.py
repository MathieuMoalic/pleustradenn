from datetime import date

from sqlmodel import select

from backend.database import get_session
from backend.env import ADMIN_PASSWORD, ADMIN_USERNAME
from backend.models import (
    Exercise,
    ExerciseCreate,
    Session,
    SessionCreate,
    SessionExercise,
    SessionExerciseCreate,
    User,
    UserCreate,
)
from backend.router.exercise import create_exercise_endpoint
from backend.router.session import create_session_endpoint
from backend.router.session_exercise import create_session_exercise_endpoint
from backend.router.user import create_user_endpoint


def init_db_data():
    session = next(get_session())
    if session.exec(select(User)).first() is None:
        data = UserCreate(username=ADMIN_USERNAME, password=ADMIN_PASSWORD)
        create_user_endpoint(data, session)

    if session.exec(select(Exercise)).first() is None:
        exercises = [
            ExerciseCreate(name="Squat", notes="Legs workout"),
            ExerciseCreate(name="Bench Press", notes="Chest workout"),
            ExerciseCreate(name="Deadlift", notes="Back workout"),
            ExerciseCreate(name="Pull-Up", notes="Back and arms"),
            ExerciseCreate(name="Running", notes="Cardio"),
        ]
        for exercise in exercises:
            try:
                create_exercise_endpoint(exercise, session)
            except ValueError as e:
                print(f"Error creating exercise: {e}")

    if session.exec(select(Session)).first() is None:
        user = session.exec(select(User).where(User.id == 1)).first()
        if user:
            try:
                create_session_endpoint(
                    SessionCreate(
                        user_id=user.id,
                        date=date.today(),
                        notes="Morning strength training",
                    ),
                    session,
                )
                create_session_endpoint(
                    SessionCreate(
                        user_id=user.id,
                        date=date.today(),
                        notes="Evening cardio session",
                    ),
                    session,
                )
            except ValueError as e:
                print(f"Error creating training sessions: {e}")

    if session.exec(select(SessionExercise)).first() is None:
        training_session = session.exec(
            select(Session).where(Session.notes == "Morning strength training")
        ).first()
        exercises = session.exec(select(Exercise)).all()
        if training_session and exercises:
            session_exercises = [
                SessionExerciseCreate(
                    session_id=training_session.id,
                    exercise_id=exercises[0].id,
                    sets=3,
                    reps=10,
                    weight=100,
                    rest_seconds=60,
                    count=1,
                ),
                SessionExerciseCreate(
                    session_id=training_session.id,
                    exercise_id=exercises[1].id,
                    sets=3,
                    reps=8,
                    weight=80,
                    rest_seconds=90,
                    count=1,
                ),
                SessionExerciseCreate(
                    session_id=training_session.id,
                    exercise_id=exercises[2].id,
                    sets=3,
                    reps=5,
                    weight=120,
                    rest_seconds=120,
                    count=1,
                ),
            ]
            for session_exercise in session_exercises:
                try:
                    create_session_exercise_endpoint(session_exercise, session)
                except ValueError as e:
                    print(f"Error creating session exercise: {e}")
