import os
from typing import Union

from openapi_server.apis.post_api_base import BasePOSTApi
from openapi_server.big_query import (
    insert_google_user_table,
    insert_user_video_table,
)
from openapi_server.models.error_response400 import (
    ErrorResponse400,
)
from openapi_server.models.post_user_request import (
    PostUserRequest,
)
from openapi_server.models.post_user_response import (
    PostUserResponse,
)
from openapi_server.models.post_video_request import (
    PostVideoRequest,
)
from openapi_server.models.post_video_response import (
    PostVideoResponse,
)
from openapi_server.process_source import process_source

GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
DATASET_ID = os.getenv("DATASET_ID")


class POSTApiImpl(BasePOSTApi):
    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> Union[PostUserResponse, ErrorResponse400]:
        """ユーザー情報を登録します。"""
        try:
            return insert_google_user_table(
                project_id=GOOGLE_CLOUD_PROJECT,
                dataset_id=DATASET_ID,
                table_id="googleID-userID",
                google_id=post_user_request.google_id,
            )
        except Exception as e:
            return ErrorResponse400(
                error=f"Bad Request: {str(e)}"
            )

    async def video_post(
        self,
        post_video_request: PostVideoRequest,
    ) -> Union[PostVideoResponse, ErrorResponse400]:
        """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
        try:
            process_source(post_video_request.dict())
            return insert_user_video_table(
                project_id=GOOGLE_CLOUD_PROJECT,
                dataset_id=DATASET_ID,
                table_id="userID-videoID",
                user_id=post_video_request.user_id,
                video_id=post_video_request.youtube_id,
            )

        except Exception as e:
            return ErrorResponse400(
                error=f"Bad Request: {str(e)}"
            )
