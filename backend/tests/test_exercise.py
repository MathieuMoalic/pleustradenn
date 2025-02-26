def test_read_exercises(client):
    response = client.get(
        "/api/exercises",
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_exercise(client):
    exercise_data = {
        "name": "Squat",
        "notes": "Strength exercise",
    }

    response = client.post(
        "/api/exercises",
        json=exercise_data,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Squat"


def test_update_exercise(client):
    exercise = client.post(
        "/api/exercises",
        json={"name": "Push-Up", "notes": ""},
    )
    exercise_id = exercise.json()["id"]
    response = client.put(
        f"/api/exercises/{exercise_id}",
        json={"name": "Push-Up Advanced"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Push-Up Advanced"


def test_delete_exercise(client):
    exercise = client.post(
        "/api/exercises",
        json={"name": "Deadlift", "notes": ""},
    )
    exercise_id = exercise.json()["id"]
    response = client.delete(
        f"/api/exercises/{exercise_id}",
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Deadlift"
