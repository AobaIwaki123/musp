# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictStr  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.error_response import ErrorResponse  # noqa: F401
from openapi_server.models.thumbnail_job_id_get200_response import ThumbnailJobIdGet200Response  # noqa: F401
from openapi_server.models.url_job_id_get200_response import UrlJobIdGet200Response  # noqa: F401


def test_thumbnail_job_id_get(client: TestClient):
    """Test case for thumbnail_job_id_get

    分離された音源のサムネイル画像の取得
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/thumbnail/{job_id}".format(job_id='job_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_url_job_id_get(client: TestClient):
    """Test case for url_job_id_get

    分離された音源の取得
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/url/{job_id}".format(job_id='job_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

