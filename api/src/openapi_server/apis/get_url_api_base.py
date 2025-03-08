# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.get_url_response import GetURLResponse
from pydantic import Field
from typing_extensions import Annotated


class BaseGetURLApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseGetURLApi.subclasses = BaseGetURLApi.subclasses + (cls,)

    async def thumbnail_job_id_get(
        self,
        job_id: Annotated[
            str, Field(strict=True, description="ジョブの識別子")
        ],
    ) -> GetURLResponse:
        """分離された音源のサムネイル画像のS3 URLを取得します。"""
        ...

    async def url_job_id_get(
        self,
        job_id: Annotated[
            str, Field(strict=True, description="ジョブの識別子")
        ],
    ) -> GetURLResponse:
        """分離された音源のS3 URLを取得します。"""
        ...
