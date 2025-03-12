# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, field_validator  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.error_response import ErrorResponse  # noqa: F401
from openapi_server.models.get_video_id_response import GetVideoIDResponse  # noqa: F401
from openapi_server.models.get_wav_response import GetWavResponse  # noqa: F401


def test_video_id_user_id_get(client: TestClient):
    """Test case for video_id_user_id_get

    ユーザーのYouTubeID一覧取得
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/video_id/{user_id}".format(user_id='testUser'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_wav_video_id_get(client: TestClient):
    """Test case for wav_video_id_get

    分離済み音源の取得
    """

    headers = {
        "ApiKeyAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/wav/{video_id}".format(video_id='57Q4Hp46oXc'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

