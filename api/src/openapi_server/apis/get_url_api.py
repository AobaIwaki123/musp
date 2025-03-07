# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.get_url_api_base import BaseGetURLApi
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
from pydantic import Field, StrictStr
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.thumbnail_job_id_get200_response import ThumbnailJobIdGet200Response
from openapi_server.models.url_job_id_get200_response import UrlJobIdGet200Response
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/thumbnail/{job_id}",
    responses={
        200: {"model": ThumbnailJobIdGet200Response, "description": "サムネイル画像のS3 URLを返却"},
        404: {"model": ErrorResponse, "description": "サムネイル画像が見つかりませんでした"},
    },
    tags=["GetURL"],
    summary="分離された音源のサムネイル画像の取得",
    response_model_by_alias=True,
)
async def thumbnail_job_id_get(
    job_id: Annotated[StrictStr, Field(description="ジョブの識別子")] = Path(..., description="ジョブの識別子"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> ThumbnailJobIdGet200Response:
    """分離された音源のサムネイル画像のS3 URLを取得します。"""
    if not BaseGetURLApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseGetURLApi.subclasses[0]().thumbnail_job_id_get(job_id)


@router.get(
    "/url/{job_id}",
    responses={
        200: {"model": UrlJobIdGet200Response, "description": "音源ファイルのS3 URLを返却"},
        404: {"model": ErrorResponse, "description": "音源が見つかりませんでした"},
    },
    tags=["GetURL"],
    summary="分離された音源の取得",
    response_model_by_alias=True,
)
async def url_job_id_get(
    job_id: Annotated[StrictStr, Field(description="ジョブの識別子")] = Path(..., description="ジョブの識別子"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> UrlJobIdGet200Response:
    """分離された音源のS3 URLを取得します。"""
    if not BaseGetURLApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseGetURLApi.subclasses[0]().url_job_id_get(job_id)
