# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.thumbnail_job_id_get200_response import ThumbnailJobIdGet200Response
from openapi_server.models.url_job_id_get200_response import UrlJobIdGet200Response
from openapi_server.security_api import get_token_ApiKeyAuth

class BaseGetURLApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseGetURLApi.subclasses = BaseGetURLApi.subclasses + (cls,)
    async def thumbnail_job_id_get(
        self,
        job_id: Annotated[StrictStr, Field(description="ジョブの識別子")],
    ) -> ThumbnailJobIdGet200Response:
        """分離された音源のサムネイル画像のS3 URLを取得します。"""
        ...


    async def url_job_id_get(
        self,
        job_id: Annotated[StrictStr, Field(description="ジョブの識別子")],
    ) -> UrlJobIdGet200Response:
        """分離された音源のS3 URLを取得します。"""
        ...
