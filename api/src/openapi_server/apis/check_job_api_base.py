# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.get_jobs_response import GetJobsResponse
from pydantic import Field
from typing_extensions import Annotated


class BaseCheckJobApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseCheckJobApi.subclasses = BaseCheckJobApi.subclasses + (
            cls,
        )

    async def jobs_job_id_get(
        self,
        job_id: Annotated[
            str, Field(strict=True, description="ジョブの識別子")
        ],
    ) -> GetJobsResponse:
        """指定されたジョブIDの状態を取得します。"""
        ...

    async def ws_jobs_job_id_get(
        self,
        job_id: Annotated[
            str, Field(strict=True, description="ジョブの識別子")
        ],
    ) -> None:
        """WebSocketを使用して、ジョブの進捗状況をリアルタイムで取得します。"""
        ...
