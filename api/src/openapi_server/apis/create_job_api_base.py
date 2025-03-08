# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.post_jobs_request import PostJobsRequest
from openapi_server.models.post_jobs_response import PostJobsResponse


class BaseCreateJobApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseCreateJobApi.subclasses = BaseCreateJobApi.subclasses + (
            cls,
        )

    async def jobs_post(
        self,
        post_jobs_request: PostJobsRequest,
    ) -> PostJobsResponse:
        """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
        ...
