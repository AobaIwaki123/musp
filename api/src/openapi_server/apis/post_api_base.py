# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response200 import PostUserResponse200
from openapi_server.models.post_user_response201 import PostUserResponse201
from openapi_server.models.post_video_request import PostVideoRequest
from openapi_server.models.post_video_response200 import PostVideoResponse200
from openapi_server.models.post_video_response202 import PostVideoResponse202
from openapi_server.security_api import get_token_ApiKeyAuth

class BasePOSTApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePOSTApi.subclasses = BasePOSTApi.subclasses + (cls,)
    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> PostUserResponse200:
        """ユーザー情報を登録します。"""
        ...


    async def video_post(
        self,
        post_video_request: PostVideoRequest,
    ) -> PostVideoResponse200:
        """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
        ...
