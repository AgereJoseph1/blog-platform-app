import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_signup_and_login(app_client: AsyncClient):
    # Signup
    resp = await app_client.post(
        "/auth/signup",
        json={"email": "user@example.com", "password": "strongpassword"},
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["email"] == "user@example.com"
    assert "id" in data

    # Login
    resp = await app_client.post(
        "/auth/login",
        data={"username": "user@example.com", "password": "strongpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200, resp.text
    token_data = resp.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
