# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.get_api_base import BaseGETApi
import openapi_server.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from openapi_server.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, field_validator
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.get_video_id_response import GetVideoIDResponse
from openapi_server.models.get_wav_response import GetWavResponse
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/video_id/{user_id}",
    responses={
        200: {"model": GetVideoIDResponse, "description": "ユーザーのYouTubeID一覧を取得しました"},
        400: {"model": ErrorResponse, "description": "不正なリクエスト"},
    },
    tags=["GET"],
    summary="ユーザーのYouTubeID一覧取得",
    response_model_by_alias=True,
)
async def video_id_user_id_get(
    user_id: Annotated[str, Field(strict=True, description="ユーザーID")] = Path(..., description="ユーザーID"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> GetVideoIDResponse:
    """ユーザーが作成したYouTubeIDの一覧を取得します。"""
    if not BaseGETApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseGETApi.subclasses[0]().video_id_user_id_get(user_id)


@router.get(
    "/wav/{video_id}",
    responses={
        200: {"model": GetWavResponse, "description": "分離済み音源のダウンロードリンクを取得しました"},
        400: {"model": ErrorResponse, "description": "不正なリクエスト"},
    },
    tags=["GET"],
    summary="分離済み音源の取得",
    response_model_by_alias=True,
)
async def wav_video_id_get(
    video_id: Annotated[str, Field(strict=True, description="YouTubeの動画ID")] = Path(..., description="YouTubeの動画ID", regex=r"/^[a-zA-Z0-9_-]{11}$/"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> GetWavResponse:
    """分離済み音源のダウンロードリンクを取得します。"""
    if not BaseGETApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseGETApi.subclasses[0]().wav_video_id_get(video_id)
