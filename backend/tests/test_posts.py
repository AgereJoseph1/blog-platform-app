import pytest
from httpx import AsyncClient


async def create_user_and_token(client: AsyncClient) -> str:
    await client.post(
        "/auth/signup",
        json={"email": "author@example.com", "password": "strongpassword"},
    )
    resp = await client.post(
        "/auth/login",
        data={"username": "author@example.com", "password": "strongpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token_data = resp.json()
    return token_data["access_token"]


@pytest.mark.asyncio
async def test_create_list_get_update_delete_post(app_client: AsyncClient):
    token = await create_user_and_token(app_client)
    headers = {"Authorization": f"Bearer {token}"}

    # Create post
    resp = await app_client.post(
        "/posts/",
        json={"title": "First Post", "content": "Content"},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    post = resp.json()
    post_id = post["id"]

    # List posts
    resp = await app_client.get("/posts/")
    assert resp.status_code == 200
    posts = resp.json()
    assert any(p["id"] == post_id for p in posts)

    # Get single post
    resp = await app_client.get(f"/posts/{post_id}")
    assert resp.status_code == 200
    fetched = resp.json()
    assert fetched["id"] == post_id

    # Update post
    resp = await app_client.put(
        f"/posts/{post_id}",
        json={"title": "Updated", "content": "Updated content"},
        headers=headers,
    )
    assert resp.status_code == 200
    updated = resp.json()
    assert updated["title"] == "Updated"

    # Delete post
    resp = await app_client.delete(f"/posts/{post_id}", headers=headers)
    assert resp.status_code == 204

    # Ensure deleted
    resp = await app_client.get(f"/posts/{post_id}")
    assert resp.status_code == 404
