from typing import Union

from openapi_server.apis.get_api_base import BaseGETApi
from openapi_server.models.error_response400 import (
    ErrorResponse400,
)
from openapi_server.models.get_video_id_and_wav_url_response import (
    GetVideoIDAndWavURLResponse,
)


class GETApiImpl(BaseGETApi):
    async def user_id_get(
        self, user_id: str
    ) -> Union[
        GetVideoIDAndWavURLResponse, ErrorResponse400
    ]:
        # Mock実装
        if user_id == "1":
            return GetVideoIDAndWavURLResponse(
                status_code=200,
                status_message="OK",
                data=[
                    {"youtube_id": "3Uem84SdteM", "wav_url": "https://example.com/3Uem84SdteM.wav"}
                ],
            )
        else:
            return ErrorResponse400(
                error="Bad Request",
            )

