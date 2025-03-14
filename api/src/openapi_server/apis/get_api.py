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
from pydantic import Field
from typing_extensions import Annotated
from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.get_video_id_and_wav_url_response200 import GetVideoIDAndWavURLResponse200
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/{user_id}",
    responses={
        200: {"model": GetVideoIDAndWavURLResponse200, "description": "ユーザーのYouTubeIDとWavURLの一覧を取得しました"},
        400: {"model": ErrorResponse400, "description": "不正なリクエスト"},
    },
    tags=["GET"],
    summary="ユーザーのYouTubeIDとWavURLの一覧取得",
    response_model_by_alias=True,
)
async def user_id_get(
    user_id: Annotated[str, Field(strict=True, description="ユーザーID")] = Path(..., description="ユーザーID"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> GetVideoIDAndWavURLResponse200:
    """ユーザーが作成したYouTubeIDとWavURLの一覧を取得します。"""
    if not BaseGETApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseGETApi.subclasses[0]().user_id_get(user_id)
