from datetime import date
from os import environ

from sqlmodel import Session as DBSession
from sqlmodel import select

from backend.database import engine, get_session
from backend.models import (
    Exercise,
    ExerciseCreate,
    Session,
    SessionCreate,
    SessionExercise,
    SessionExerciseCreate,
    User,
)
from backend.router.user import create_user_endpoint


def init_db_data():
    session = next(get_session())
    print(session)
    print("Creating initial data...")

    if session.exec(select(User)).first() is None:
        admin_username = environ.get("ADMIN_USERNAME")
        admin_password = environ.get("ADMIN_PASSWORD")
        if not admin_username or not admin_password:
            raise ValueError("ADMIN_USERNAME and ADMIN_PASSWORD must be set.")
        create_user_endpoint(
            session, {"username": admin_username, "password": admin_password}
        )

        # if session.exec(select(Exercise)).first() is None:
        #     exercises = [
        #         ExerciseCreate(name="Squat", notes="Legs workout"),
        #         ExerciseCreate(name="Bench Press", notes="Chest workout"),
        #         ExerciseCreate(name="Deadlift", notes="Back workout"),
        #         ExerciseCreate(name="Pull-Up", notes="Back and arms"),
        #         ExerciseCreate(name="Running", notes="Cardio"),
        #     ]
        # for exercise in exercises:
        #     try:
        #         create_exercise(session, exercise)
        #     except ValueError as e:
        #         print(f"Error creating exercise: {e}")

        # if session.exec(select(Session)).first() is None:
        #     user = session.exec(select(User).where(User.id == 1)).first()
        #     if user:
        #         try:
        #             create_session(
        #                 session,
        #                 SessionCreate(
        #                     user_id=user.id,
        #                     date=date.today(),
        #                     notes="Morning strength training",
        #                 ),
        #             )
        #             create_session(
        #                 session,
        #                 SessionCreate(
        #                     user_id=user.id,
        #                     date=date.today(),
        #                     notes="Evening cardio session",
        #                 ),
        #             )
        #         except ValueError as e:
        #             print(f"Error creating training sessions: {e}")

        # if session.exec(select(SessionExercise)).first() is None:
        #     training_session = session.exec(
        #         select(Session).where(Session.notes == "Morning strength training")
        #     ).first()
        #     exercises = session.exec(select(Exercise)).all()
        #     if training_session and exercises:
        #         session_exercises = [
        #             SessionExerciseCreate(
        #                 session_id=training_session.id,
        #                 exercise_id=exercises[0].id,
        #                 sets=3,
        #                 reps=10,
        #                 weight=100,
        #                 rest_time=60,
        #                 count=1,
        #             ),
        #             SessionExerciseCreate(
        #                 session_id=training_session.id,
        #                 exercise_id=exercises[1].id,
        #                 sets=3,
        #                 reps=8,
        #                 weight=80,
        #                 rest_time=90,
        #                 count=1,
        #             ),
        #             SessionExerciseCreate(
        #                 session_id=training_session.id,
        #                 exercise_id=exercises[2].id,
        #                 sets=3,
        #                 reps=5,
        #                 weight=120,
        #                 rest_time=120,
        #                 count=1,
        #             ),
        #         ]
        #         for session_exercise in session_exercises:
        #             try:
        #                 create_session_exercise(session, session_exercise)
        #             except ValueError as e:
        #                 print(f"Error creating session exercise: {e}")

        print("Initial data setup complete.")
