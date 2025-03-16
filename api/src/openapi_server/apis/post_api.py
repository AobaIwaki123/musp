# coding: utf-8

from typing import Dict, List, Union  # noqa: F401
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

from fastapi.responses import JSONResponse
from openapi_server.models.extra_models import TokenModel  # noqa: F401
from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse
from openapi_server.models.post_video_request import PostVideoRequest
from openapi_server.models.post_video_response import PostVideoResponse
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)

@router.post(
    "/users",
    responses={
        200: {"model": PostUserResponse, "description": "User already exists"},
        400: {"model": ErrorResponse400, "description": "Invalid request"},
    },
    tags=["POST"],
    summary="Register user information",
    response_model_by_alias=True,
)
async def users_post(
    post_user_request: PostUserRequest = Body(None, description=""),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> Union[PostUserResponse, ErrorResponse400]:
    """Registers user information."""
    if not BasePOSTApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    
    result = await BasePOSTApi.subclasses[0]().users_post(post_user_request)
    
    if isinstance(result, Response):
        return result
    
    if isinstance(result, PostUserResponse):
        return JSONResponse(content=result.dict(), status_code=200)
    if isinstance(result, ErrorResponse400):
        return JSONResponse(content=result.dict(), status_code=400)
    
    raise HTTPException(status_code=500, detail="Unexpected response type")



@router.post(
    "/video",
    responses={
        200: {"model": PostVideoResponse, "description": "The video is already registered"},
        400: {"model": ErrorResponse400, "description": "Invalid request"},
    },
    tags=["POST"],
    summary="Create a new job",
    response_model_by_alias=True,
)
async def video_post(
    post_video_request: PostVideoRequest = Body(None, description=""),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> Union[PostVideoResponse, ErrorResponse400]:
    """Creates a job to download audio from a YouTube link and separate the audio and vocals."""
    if not BasePOSTApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    
    result = await BasePOSTApi.subclasses[0]().video_post(post_video_request)
    
    if isinstance(result, Response):
        return result
    
    if isinstance(result, PostVideoResponse):
        return JSONResponse(content=result.dict(), status_code=200)
    if isinstance(result, ErrorResponse400):
        return JSONResponse(content=result.dict(), status_code=400)
    
    raise HTTPException(status_code=500, detail="Unexpected response type")

