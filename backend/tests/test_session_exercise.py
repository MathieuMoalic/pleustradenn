import pytest


@pytest.fixture
def create_session(client):
    def _create_session(date="2025-01-24", notes="Test session"):
        r = client.post("/api/sessions", json={"date": date, "notes": notes})
        assert r.status_code == 200
        return r.json()["id"]

    return _create_session


@pytest.fixture
def create_exercise(client):
    def _create_exercise(name="Squat", notes="Lower body exercise"):
        r = client.post("/api/exercises", json={"name": name, "notes": notes})
        assert r.status_code == 200
        return r.json()["id"]

    return _create_exercise


@pytest.fixture
def create_session_exercise(client, create_session, create_exercise):
    def _create_session_exercise(
        session_id=None,
        exercise_id=None,
        sets=4,
        reps=10,
        weight=60.0,
        rest_seconds=90,
        count=2,
    ):
        if not session_id:
            session_id = create_session()
        if not exercise_id:
            exercise_id = create_exercise()
        data = {
            "session_id": session_id,
            "exercise_id": exercise_id,
            "sets": sets,
            "reps": reps,
            "weight": weight,
            "rest_seconds": rest_seconds,
            "count": count,
        }
        r = client.post("/api/session-exercises", json=data)
        assert r.status_code == 200
        return r.json()

    return _create_session_exercise


def test_create_session_exercise(client, create_session_exercise):
    se = create_session_exercise(sets=3, reps=12, weight=0.0, rest_seconds=60, count=1)
    assert se["sets"] == 3
    assert se["reps"] == 12
    assert se["weight"] == 0.0
    assert se["rest_seconds"] == 60
    assert se["count"] == 1


def test_read_session_exercises(client):
    r = client.get("/api/session-exercises")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_update_session_exercise(client, create_session_exercise):
    se = create_session_exercise()
    se_id = se["id"]
    r = client.put(
        f"/api/session-exercises/{se_id}",
        json={"sets": 5, "reps": 15, "weight": 65.0, "count": 3},
    )
    assert r.status_code == 200
    updated = r.json()
    assert updated["id"] == se_id
    assert updated["sets"] == 5
    assert updated["reps"] == 15
    assert updated["weight"] == 65.0
    assert updated["count"] == 3


def test_delete_session_exercise(client, create_session_exercise):
    se = create_session_exercise()
    se_id = se["id"]
    r = client.delete(f"/api/session-exercises/{se_id}")
    assert r.status_code == 200
    deleted = r.json()
    assert deleted["id"] == se_id
    assert deleted["sets"] == se["sets"]
    r = client.get("/api/session-exercises")
    existing = [x["id"] for x in r.json()]
    assert se_id not in existing


def test_invalid_exercise(client, create_session):
    sid = create_session()
    r = client.post(
        "/api/session-exercises",
        json={
            "session_id": sid,
            "exercise_id": 999999,
            "sets": 2,
            "reps": 10,
            "weight": 20.0,
            "rest_seconds": 60,
            "count": 1,
        },
    )
    assert r.status_code == 422 or r.status_code == 400


def test_invalid_session_exercise_get(client):
    r = client.get("/api/session-exercises/999999")
    assert r.status_code == 422 or r.status_code == 400
