# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.error_response import ErrorResponse  # noqa: F401
from openapi_server.models.post_user_request import PostUserRequest  # noqa: F401
from openapi_server.models.post_user_response import PostUserResponse  # noqa: F401


def test_user_post(client: TestClient):
    """Test case for user_post

    ユーザー情報の登録
    """
    post_user_request = {"google_id":"testGoogleID","nickname":"testNickname","icon_url":"https://example.com/icon.jpg"}

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/user",
    #    headers=headers,
    #    json=post_user_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

