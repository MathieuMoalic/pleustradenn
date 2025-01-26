from datetime import date
from os import environ

from sqlmodel import Session, SQLModel, create_engine, select

from backend.crud.exercise import create_exercise
from backend.crud.user import create_user
from backend.crud.workout import create_workout
from backend.crud.workout_exercise import create_workout_exercise
from backend.models import Exercise, User, Workout, WorkoutExercise

DATABASE_URL = environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL, echo=False)  # Disable SQL debug logs
SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency used to provide a DB session in FastAPI endpoints.
    """
    with Session(engine) as session:
        yield session


with Session(engine) as session:
    if len(session.exec(select(User)).all()) == 0:
        admin_username = environ.get("ADMIN_USERNAME")
        admin_password = environ.get("ADMIN_PASSWORD")
        if admin_username is None or admin_password is None:
            raise ValueError(
                "ADMIN_USERNAME and ADMIN_PASSWORD must be set as environment variables to create the database."
            )
        create_user(session, {"username": admin_username, "password": admin_password})

    if len(session.exec(select(Exercise)).all()) == 0:
        exercises_data = [
            {
                "name": "Squat",
                "category": "Strength",
                "muscle_group": "Legs",
                "equipment": "Barbell",
            },
            {
                "name": "Bench Press",
                "category": "Strength",
                "muscle_group": "Chest",
                "equipment": "Barbell",
            },
            {
                "name": "Deadlift",
                "category": "Strength",
                "muscle_group": "Back",
                "equipment": "Barbell",
            },
            {
                "name": "Pull-Up",
                "category": "Strength",
                "muscle_group": "Back",
                "equipment": "Bodyweight",
            },
            {
                "name": "Running",
                "category": "Cardio",
                "muscle_group": "Legs",
                "equipment": "None",
            },
        ]
        for exercise_data in exercises_data:
            try:
                create_exercise(session, exercise_data)
            except ValueError as e:
                print(f"Error creating exercise: {e}")
        print("Created initial exercises.")

    if len(session.exec(select(Workout)).all()) == 0:
        user = session.exec(select(User).where(User.id == 1)).first()
        if user:
            try:
                create_workout(
                    session,
                    {
                        "user_id": user.id,
                        "date": date.today(),
                        "notes": "Morning strength training",
                    },
                )
                create_workout(
                    session,
                    {
                        "user_id": user.id,
                        "date": date.today(),
                        "notes": "Evening cardio session",
                    },
                )
                print("Created initial workouts.")
            except ValueError as e:
                print(f"Error creating workouts: {e}")

    if len(session.exec(select(WorkoutExercise)).all()) == 0:
        workout = session.exec(
            select(Workout).where(Workout.notes == "Morning strength training")
        ).first()
        exercises = session.exec(select(Exercise)).all()
        if workout and exercises:
            workout_exercises_data = [
                {
                    "workout_id": workout.id,
                    "exercise_id": exercises[0].id,
                    "sets": 3,
                    "reps": 10,
                    "weight": 100,
                    "rest_time": 60,
                },
                {
                    "workout_id": workout.id,
                    "exercise_id": exercises[1].id,
                    "sets": 3,
                    "reps": 8,
                    "weight": 80,
                    "rest_time": 90,
                },
                {
                    "workout_id": workout.id,
                    "exercise_id": exercises[2].id,
                    "sets": 3,
                    "reps": 5,
                    "weight": 120,
                    "rest_time": 120,
                },
            ]
            for workout_exercise_data in workout_exercises_data:
                try:
                    create_workout_exercise(session, workout_exercise_data)
                except ValueError as e:
                    print(f"Error creating workout exercise: {e}")
            print("Created initial workout exercises.")
