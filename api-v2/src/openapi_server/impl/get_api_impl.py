from typing import Union
from openapi_server.apis.get_api_base import BaseGETApi
from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.get_video_id_and_wav_url_response import GetVideoIDAndWavURLResponse
from openapi_server.models.video_id_and_wav_url import VideoIDAndWavURL
from openapi_server.bigquery import get_videos_by_user_id
import logging

class GETApiImpl(BaseGETApi):
    async def user_id_get(
        self,
        user_id: str,
    ) -> Union[GetVideoIDAndWavURLResponse, ErrorResponse400]:
        try:
            videos_data = get_videos_by_user_id(user_id)
            videos = [VideoIDAndWavURL(**v) for v in videos_data]
            
            return GetVideoIDAndWavURLResponse(
                status_code=200,
                status_message="Retrieved the list of YouTube IDs and Wav URLs for the user",
                data=videos
            )
        except Exception as e:
            logging.error(f"Error retrieving videos for user {user_id}: {e}")
            return ErrorResponse400(error=str(e))
