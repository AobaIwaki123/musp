# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, field_validator
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.get_info_list_response import GetInfoListResponse
from openapi_server.models.get_url_response import GetURLResponse
from openapi_server.security_api import get_token_ApiKeyAuth

class BaseGetURLApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseGetURLApi.subclasses = BaseGetURLApi.subclasses + (cls,)
    async def info_user_id_get(
        self,
        user_id: Annotated[str, Field(strict=True, description="ユーザーID")],
    ) -> GetInfoListResponse:
        """ギャラリー表示のための情報を取得します。"""
        ...


    async def thumbnail_job_id_get(
        self,
        job_id: Annotated[str, Field(strict=True, description="ジョブの識別子")],
    ) -> GetURLResponse:
        """分離された音源のサムネイル画像のS3 URLを取得します。"""
        ...


    async def url_job_id_get(
        self,
        job_id: Annotated[str, Field(strict=True, description="ジョブの識別子")],
    ) -> GetURLResponse:
        """分離された音源のS3 URLを取得します。"""
        ...
