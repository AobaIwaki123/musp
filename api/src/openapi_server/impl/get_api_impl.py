from typing import Union

from openapi_server.apis.get_api_base import BaseGETApi
from openapi_server.big_query.get_user_video import (
    get_user_video,
)
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
        try:
            return get_user_video(user_id)
        except Exception as e:
            return ErrorResponse400(
                error=f"Bad Request: {str(e)}"
            )
