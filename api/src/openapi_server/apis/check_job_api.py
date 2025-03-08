# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.check_job_api_base import BaseCheckJobApi
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
from typing import Any
from typing_extensions import Annotated
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.get_jobs_response import GetJobsResponse
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/jobs/{job_id}",
    responses={
        200: {"model": GetJobsResponse, "description": "ジョブの状態情報"},
        404: {"model": ErrorResponse, "description": "ジョブが見つかりませんでした"},
    },
    tags=["CheckJob"],
    summary="ジョブの状態確認",
    response_model_by_alias=True,
)
async def jobs_job_id_get(
    job_id: Annotated[str, Field(strict=True, description="ジョブの識別子")] = Path(..., description="ジョブの識別子", regex=r"/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> GetJobsResponse:
    """指定されたジョブIDの状態を取得します。"""
    if not BaseCheckJobApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseCheckJobApi.subclasses[0]().jobs_job_id_get(job_id)


@router.get(
    "/ws/jobs/{job_id}",
    responses={
        101: {"description": "WebSocket接続成功"},
        404: {"description": "ジョブが見つかりませんでした"},
    },
    tags=["CheckJob"],
    summary="ジョブの進捗状況をWebSocketで取得",
    response_model_by_alias=True,
)
async def ws_jobs_job_id_get(
    job_id: Annotated[str, Field(strict=True, description="ジョブの識別子")] = Path(..., description="ジョブの識別子", regex=r"/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> None:
    """WebSocketを使用して、ジョブの進捗状況をリアルタイムで取得します。"""
    if not BaseCheckJobApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseCheckJobApi.subclasses[0]().ws_jobs_job_id_get(job_id)
