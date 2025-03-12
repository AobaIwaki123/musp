# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.error_response import ErrorResponse  # noqa: F401
from openapi_server.models.post_jobs_request import PostJobsRequest  # noqa: F401
from openapi_server.models.post_jobs_response import PostJobsResponse  # noqa: F401
from openapi_server.models.post_user_request import PostUserRequest  # noqa: F401
from openapi_server.models.post_user_response import PostUserResponse  # noqa: F401


def test_jobs_post(client: TestClient):
    """Test case for jobs_post

    新規ジョブの作成
    """
    post_jobs_request = {"user_id":"testUser","youtube_url":"https://www.youtube.com/watch?v=57Q4Hp46oXc"}

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/jobs",
    #    headers=headers,
    #    json=post_jobs_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_users_post(client: TestClient):
    """Test case for users_post

    ユーザー情報の登録
    """
    post_user_request = {"google_id":"testGoogleID","nickname":"testNickname","icon_url":"https://example.com/icon.jpg"}

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

