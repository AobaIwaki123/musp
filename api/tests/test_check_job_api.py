# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictStr  # noqa: F401
from typing import Any  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.error_response import ErrorResponse  # noqa: F401
from openapi_server.models.jobs_job_id_get200_response import JobsJobIdGet200Response  # noqa: F401


def test_jobs_job_id_get(client: TestClient):
    """Test case for jobs_job_id_get

    ジョブの状態確認
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/jobs/{job_id}".format(job_id='job_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_ws_jobs_job_id_get(client: TestClient):
    """Test case for ws_jobs_job_id_get

    ジョブの進捗状況をWebSocketで取得
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/ws/jobs/{job_id}".format(job_id='job_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

