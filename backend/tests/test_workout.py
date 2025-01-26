def test_read_workouts(auth_client):
    response = auth_client.get(
        "/api/workouts",
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_workout(auth_client, test_user):
    workout_data = {
        "user_id": test_user.id,
        "date": "2025-01-24",  # Optional field
        "notes": "Morning workout session with focus on full body",
    }
    response = auth_client.post(
        "/api/workouts",
        json=workout_data,
    )
    assert response.status_code == 200
    assert response.json()["user_id"] == test_user.id
    assert response.json()["notes"] == "Morning workout session with focus on full body"


def test_update_workout(auth_client, test_user):
    workout = auth_client.post(
        "/api/workouts",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Initial workout notes",
        },
    )
    workout_id = workout.json()["id"]

    response = auth_client.put(
        f"/api/workouts/{workout_id}",
        json={"notes": "Updated workout notes"},
    )
    assert response.status_code == 200
    assert response.json()["id"] == workout_id
    assert response.json()["notes"] == "Updated workout notes"


def test_delete_workout(auth_client, test_user):
    workout = auth_client.post(
        "/api/workouts",
        json={
            "user_id": test_user.id,
            "date": "2025-01-24",
            "notes": "Workout to be deleted",
        },
    )
    workout_id = workout.json()["id"]

    response = auth_client.delete(
        f"/api/workouts/{workout_id}",
    )
    assert response.status_code == 200
    assert response.json()["id"] == workout_id
    assert response.json()["notes"] == "Workout to be deleted"
