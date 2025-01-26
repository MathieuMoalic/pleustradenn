def test_create_user(auth_client):
    user_data = {
        "username": "test_user",
        "password": "password123",
    }
    response = auth_client.post(
        "/api/users",
        json=user_data,
    )

    assert response.status_code == 200
    created_user = response.json()
    assert created_user["username"] == "test_user"
    assert "id" in created_user


def test_read_users(auth_client):
    auth_client.post(
        "/api/users",
        json={
            "username": "test_user_2",
            "password": "password123",
        },
    )

    response = auth_client.get("/api/users")
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
    assert len(users) >= 2
    assert any(user["username"] == "test_user_2" for user in users)


def test_update_user(auth_client, test_user):
    user_id = test_user.id
    updated_data = {
        "username": "updated_user",
        "hashed_password": "new_hashed_password",
    }
    response = auth_client.put(
        f"/api/users/{user_id}",
        json=updated_data,
    )

    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["id"] == user_id
    assert updated_user["username"] == "updated_user"


def test_delete_user(auth_client):
    user_to_delete = auth_client.post(
        "/api/users",
        json={
            "username": "delete_user",
            "password": "password123",
        },
    ).json()

    user_id = user_to_delete["id"]

    response = auth_client.delete(f"/api/users/{user_id}")
    assert response.status_code == 200
    deleted_user = response.json()
    assert deleted_user["id"] == user_id
    assert deleted_user["username"] == "delete_user"

    response = auth_client.get("/api/users")
    assert not any(user["id"] == user_id for user in response.json())
