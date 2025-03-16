# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.error_response400 import ErrorResponse400  # noqa: F401
from openapi_server.models.post_user_request import PostUserRequest  # noqa: F401
from openapi_server.models.post_user_response import PostUserResponse  # noqa: F401
from openapi_server.models.post_video_request import PostVideoRequest  # noqa: F401
from openapi_server.models.post_video_response import PostVideoResponse  # noqa: F401


def test_users_post(client: TestClient):
    """Test case for users_post

    Register user information
    """
    post_user_request = {"google_id":"testGoogleID"}

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/users",
    #    headers=headers,
    #    json=post_user_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_video_post(client: TestClient):
    """Test case for video_post

    Create a new job
    """
    post_video_request = {"user_id":"testUser","youtube_url":"https://www.youtube.com/watch?v=57Q4Hp46oXc"}

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/video",
    #    headers=headers,
    #    json=post_video_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

