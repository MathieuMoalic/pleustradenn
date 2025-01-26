def test_create_workout_exercise(auth_client, test_user):
    workout = auth_client.post(
        "/api/workouts",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout for testing exercises",
        },
    )
    workout_id = workout.json()["id"]

    exercise = auth_client.post(
        "/api/exercises",
        json={
            "name": "Push-Up",
            "description": "Upper body exercise",
            "category": "Strength",
            "muscle_group": "Chest",
            "equipment": "Bodyweight",
        },
    )
    exercise_id = exercise.json()["id"]

    workout_exercise_data = {
        "workout_id": workout_id,
        "exercise_id": exercise_id,
        "sets": 3,
        "reps": 12,
        "weight": None,
        "rest_time": 60,
    }
    response = auth_client.post(
        "/api/workout-exercises",
        json=workout_exercise_data,
    )

    assert response.status_code == 200
    workout_exercise = response.json()
    assert workout_exercise["workout_id"] == workout_id
    assert workout_exercise["exercise_id"] == exercise_id
    assert workout_exercise["sets"] == 3
    assert workout_exercise["reps"] == 12
    assert workout_exercise["rest_time"] == 60


def test_read_workout_exercises(auth_client, test_user):
    response = auth_client.get("/api/workout-exercises")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_workout_exercise(auth_client, test_user):
    workout = auth_client.post(
        "/api/workouts",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout for update testing",
        },
    )
    workout_id = workout.json()["id"]

    exercise = auth_client.post(
        "/api/exercises",
        json={
            "name": "Squat",
            "description": "Lower body exercise",
            "category": "Strength",
            "muscle_group": "Legs",
            "equipment": "Barbell",
        },
    )
    exercise_id = exercise.json()["id"]

    workout_exercise = auth_client.post(
        "/api/workout-exercises",
        json={
            "workout_id": workout_id,
            "exercise_id": exercise_id,
            "sets": 4,
            "reps": 10,
            "weight": 60.0,
            "rest_time": 90,
        },
    )
    workout_exercise_id = workout_exercise.json()["id"]

    response = auth_client.put(
        f"/api/workout-exercises/{workout_exercise_id}",
        json={"sets": 5, "reps": 15, "weight": 65.0},
    )
    assert response.status_code == 200
    updated_workout_exercise = response.json()
    assert updated_workout_exercise["id"] == workout_exercise_id
    assert updated_workout_exercise["sets"] == 5
    assert updated_workout_exercise["reps"] == 15
    assert updated_workout_exercise["weight"] == 65.0


def test_delete_workout_exercise(auth_client, test_user):
    workout = auth_client.post(
        "/api/workouts",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout for delete testing",
        },
    )
    workout_id = workout.json()["id"]

    exercise = auth_client.post(
        "/api/exercises",
        json={
            "name": "Bench Press",
            "description": "Chest strength exercise",
            "category": "Strength",
            "muscle_group": "Chest",
            "equipment": "Barbell",
        },
    )
    exercise_id = exercise.json()["id"]

    workout_exercise = auth_client.post(
        "/api/workout-exercises",
        json={
            "workout_id": workout_id,
            "exercise_id": exercise_id,
            "sets": 3,
            "reps": 8,
            "weight": 80.0,
            "rest_time": 120,
        },
    )
    workout_exercise_id = workout_exercise.json()["id"]

    response = auth_client.delete(f"/api/workout-exercises/{workout_exercise_id}")
    assert response.status_code == 200
    deleted_workout_exercise = response.json()
    assert deleted_workout_exercise["id"] == workout_exercise_id
    assert deleted_workout_exercise["sets"] == 3
    assert deleted_workout_exercise["reps"] == 8
