# coding: utf-8

import importlib
import pkgutil
from typing import Dict, List  # noqa: F401

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
from openapi_server.apis.create_job_api_base import BaseCreateJobApi
from openapi_server.impl.create_job_impl import (
    CreateJobImpl,  # noqa: F401
)
from openapi_server.models.error_response import ErrorResponse
from openapi_server.models.extra_models import (
    TokenModel,  # noqa: F401
)
from openapi_server.models.jobs_post201_response import (
    JobsPost201Response,
)
from openapi_server.models.jobs_post_request import JobsPostRequest
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(
    ns_pkg.__path__, ns_pkg.__name__ + "."
):
    importlib.import_module(name)


@router.post(
    "/jobs",
    responses={
        201: {
            "model": JobsPost201Response,
            "description": "ジョブが正常に作成されました",
        },
        400: {
            "model": ErrorResponse,
            "description": "不正なリクエスト",
        },
    },
    tags=["CreateJob"],
    summary="新規ジョブの作成",
    response_model_by_alias=True,
)
async def jobs_post(
    jobs_post_request: JobsPostRequest = Body(None, description=""),
    token_ApiKeyAuth: TokenModel = Security(get_token_ApiKeyAuth),
) -> JobsPost201Response:
    """YouTubeリンクを元に音源のダウンロードと音源/ボーカル分離のジョブを作成します。"""
    if not BaseCreateJobApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseCreateJobApi.subclasses[0]().jobs_post(
        jobs_post_request
    )
