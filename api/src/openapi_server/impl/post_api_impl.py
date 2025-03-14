from typing import Union

from openapi_server.apis.post_api_base import BasePOSTApi
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


class POSTApiImpl(BasePOSTApi):
    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> Union[PostUserResponse, ErrorResponse400]:
        """ユーザー情報を登録します。"""
        # Mock実装
        google_id = post_user_request.google_id
        if google_id == "1":
            return PostUserResponse(
                status_code=201,
                status_message="User created",
                user_id="1",
            )
        elif google_id == "2":
            return PostUserResponse(
                status_code=200,
                status_message="User already exists",
                user_id="2",
            )
        else:
            return ErrorResponse400(
                error="Bad Request",
            )
        

    async def video_post(
        self,
        post_video_request: PostVideoRequest,
    ) -> Union[PostVideoResponse, ErrorResponse400]:
        """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
        # Mock実装
        user_id = post_video_request.user_id
        if user_id == "1":
            return PostVideoResponse(
                status_code=201,
                status_message="Job created",
                youtube_id="3Uem84SdteM",
            )
        elif user_id == "2":
            return PostVideoResponse(
                status_code=200,
                status_message="Video already exists",
                youtube_id="3Uem84SdteM",
            )
        else:
            return ErrorResponse400(
                error="Bad Request",
            )
