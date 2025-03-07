# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.error_response import ErrorResponse  # noqa: F401
from openapi_server.models.jobs_post201_response import JobsPost201Response  # noqa: F401
from openapi_server.models.jobs_post_request import JobsPostRequest  # noqa: F401


def test_jobs_post(client: TestClient):
    """Test case for jobs_post

    新規ジョブの作成
    """
    jobs_post_request = openapi_server.JobsPostRequest()

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/jobs",
    #    headers=headers,
    #    json=jobs_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

