# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, field_validator
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.get_video_id_response import GetVideoIDResponse
from openapi_server.models.get_wav_response import GetWavResponse
from openapi_server.security_api import get_token_ApiKeyAuth

class BaseGETApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseGETApi.subclasses = BaseGETApi.subclasses + (cls,)
    async def video_id_user_id_get(
        self,
        user_id: Annotated[str, Field(strict=True, description="ユーザーID")],
    ) -> GetVideoIDResponse:
        """ユーザーが作成したYouTubeIDの一覧を取得します。"""
        ...


    async def wav_video_id_get(
        self,
        video_id: Annotated[str, Field(strict=True, description="YouTubeの動画ID")],
    ) -> GetWavResponse:
        """分離済み音源のダウンロードリンクを取得します。"""
        ...
