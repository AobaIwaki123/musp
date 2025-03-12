# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.post_api_base import BasePOSTApi
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
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.post_jobs_request import PostJobsRequest
from openapi_server.models.post_jobs_response import PostJobsResponse
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/jobs",
    responses={
        201: {"model": PostJobsResponse, "description": "ジョブが正常に作成されました"},
        400: {"model": ErrorResponse, "description": "不正なリクエスト"},
    },
    tags=["POST"],
    summary="新規ジョブの作成",
    response_model_by_alias=True,
)
async def jobs_post(
    post_jobs_request: PostJobsRequest = Body(None, description=""),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> PostJobsResponse:
    """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
    if not BasePOSTApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePOSTApi.subclasses[0]().jobs_post(post_jobs_request)


@router.post(
    "/users",
    responses={
        200: {"model": PostUserResponse, "description": "ユーザーが存在します"},
        201: {"model": PostUserResponse, "description": "ユーザー情報が正常に登録されました"},
        400: {"model": ErrorResponse, "description": "不正なリクエスト"},
    },
    tags=["POST"],
    summary="ユーザー情報の登録",
    response_model_by_alias=True,
)
async def users_post(
    post_user_request: PostUserRequest = Body(None, description=""),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> PostUserResponse:
    """ユーザー情報を登録します。"""
    if not BasePOSTApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePOSTApi.subclasses[0]().users_post(post_user_request)
