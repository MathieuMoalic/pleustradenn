def test_create_session_exercise(auth_client, test_user):
    session = auth_client.post(
        "/api/sessions",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout for testing exercises",
        },
    )
    session_id = session.json()["id"]

    exercise = auth_client.post(
        "/api/exercises",
        json={
            "name": "Push-Up",
            "notes": "Upper body exercise",
        },
    )
    exercise_id = exercise.json()["id"]

    session_exercise_data = {
        "session_id": session_id,
        "exercise_id": exercise_id,
        "sets": 3,
        "reps": 12,
        "weight": 0.0,
        "rest_seconds": 60,
        "count": 1,
    }
    response = auth_client.post(
        "/api/session-exercises",
        json=session_exercise_data,
    )

    assert response.status_code == 200
    session_exercise = response.json()
    assert session_exercise["session_id"] == session_id
    assert session_exercise["exercise_id"] == exercise_id
    assert session_exercise["sets"] == 3
    assert session_exercise["reps"] == 12
    assert session_exercise["rest_seconds"] == 60
    assert session_exercise["count"] == 1


def test_read_session_exercises(auth_client):
    response = auth_client.get("/api/session-exercises")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_session_exercise(auth_client, test_user):
    session = auth_client.post(
        "/api/sessions",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout for update testing",
        },
    )
    session_id = session.json()["id"]

    exercise = auth_client.post(
        "/api/exercises",
        json={
            "name": "Squat",
            "notes": "Lower body exercise",
        },
    )
    exercise_id = exercise.json()["id"]

    session_exercise = auth_client.post(
        "/api/session-exercises",
        json={
            "session_id": session_id,
            "exercise_id": exercise_id,
            "sets": 4,
            "reps": 10,
            "weight": 60.0,
            "rest_seconds": 90,
            "count": 2,
        },
    )
    session_exercise_id = session_exercise.json()["id"]

    response = auth_client.put(
        f"/api/session-exercises/{session_exercise_id}",
        json={"sets": 5, "reps": 15, "weight": 65.0, "count": 3},
    )
    assert response.status_code == 200
    updated_session_exercise = response.json()
    assert updated_session_exercise["id"] == session_exercise_id
    assert updated_session_exercise["sets"] == 5
    assert updated_session_exercise["reps"] == 15
    assert updated_session_exercise["weight"] == 65.0
    assert updated_session_exercise["count"] == 3


def test_delete_session_exercise(auth_client, test_user):
    session = auth_client.post(
        "/api/sessions",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout for delete testing",
        },
    )
    session_id = session.json()["id"]

    exercise = auth_client.post(
        "/api/exercises",
        json={
            "name": "Bench Press",
            "notes": "Chest strength exercise",
        },
    )
    exercise_id = exercise.json()["id"]

    session_exercise = auth_client.post(
        "/api/session-exercises",
        json={
            "session_id": session_id,
            "exercise_id": exercise_id,
            "sets": 3,
            "reps": 8,
            "weight": 80.0,
            "rest_seconds": 120,
            "count": 1,
        },
    )
    session_exercise_id = session_exercise.json()["id"]

    response = auth_client.delete(f"/api/session-exercises/{session_exercise_id}")
    assert response.status_code == 200
    deleted_session_exercise = response.json()
    assert deleted_session_exercise["id"] == session_exercise_id
    assert deleted_session_exercise["sets"] == 3
    assert deleted_session_exercise["reps"] == 8
    assert deleted_session_exercise["count"] == 1
