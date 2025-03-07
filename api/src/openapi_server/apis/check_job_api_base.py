# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing import Any
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.jobs_job_id_get200_response import JobsJobIdGet200Response
from openapi_server.security_api import get_token_ApiKeyAuth

class BaseCheckJobApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseCheckJobApi.subclasses = BaseCheckJobApi.subclasses + (cls,)
    async def jobs_job_id_get(
        self,
        job_id: Annotated[StrictStr, Field(description="ジョブの識別子")],
    ) -> JobsJobIdGet200Response:
        """指定されたジョブIDの状態を取得します。"""
        ...


    async def ws_jobs_job_id_get(
        self,
        job_id: Annotated[StrictStr, Field(description="ジョブの識別子")],
    ) -> None:
        """WebSocketを使用して、ジョブの進捗状況をリアルタイムで取得します。"""
        ...
