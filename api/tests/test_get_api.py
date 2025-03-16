# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.error_response400 import ErrorResponse400  # noqa: F401
from openapi_server.models.get_video_id_and_wav_url_response import GetVideoIDAndWavURLResponse  # noqa: F401


def test_user_id_get(client: TestClient):
    """Test case for user_id_get

    Retrieve a list of YouTube IDs and Wav URLs for a user
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/{user_id}".format(user_id='testUser'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

