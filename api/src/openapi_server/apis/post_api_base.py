# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.post_jobs_request import PostJobsRequest
from openapi_server.models.post_jobs_response import PostJobsResponse
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse
from openapi_server.security_api import get_token_ApiKeyAuth

class BasePOSTApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePOSTApi.subclasses = BasePOSTApi.subclasses + (cls,)
    async def jobs_post(
        self,
        post_jobs_request: PostJobsRequest,
    ) -> PostJobsResponse:
        """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
        ...


    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> PostUserResponse:
        """ユーザー情報を登録します。"""
        ...
