# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.jobs_post201_response import JobsPost201Response
from openapi_server.models.jobs_post_request import JobsPostRequest
from openapi_server.security_api import get_token_ApiKeyAuth

class BaseCreateJobApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseCreateJobApi.subclasses = BaseCreateJobApi.subclasses + (cls,)
    async def jobs_post(
        self,
        jobs_post_request: JobsPostRequest,
    ) -> JobsPost201Response:
        """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
        ...
