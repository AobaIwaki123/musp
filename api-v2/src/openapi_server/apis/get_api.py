# coding: utf-8

from typing import Dict, List, Union  # noqa: F401
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

from fastapi.responses import JSONResponse
from openapi_server.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field
from typing_extensions import Annotated
from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.get_video_id_and_wav_url_response import GetVideoIDAndWavURLResponse
from openapi_server.security_api import get_token_ApiKeyAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)

@router.get(
    "/{user_id}",
    responses={
        200: {"model": GetVideoIDAndWavURLResponse, "description": "Retrieved the list of YouTube IDs and Wav URLs for the user"},
        400: {"model": ErrorResponse400, "description": "Invalid request"},
    },
    tags=["GET"],
    summary="Retrieve a list of YouTube IDs and Wav URLs for a user",
    response_model_by_alias=True,
)
async def user_id_get(
    user_id: Annotated[str, Field(strict=True, description="User ID")] = Path(..., description="User ID"),
    token_ApiKeyAuth: TokenModel = Security(
        get_token_ApiKeyAuth
    ),
) -> Union[GetVideoIDAndWavURLResponse, ErrorResponse400]:
    """Retrieves a list of YouTube IDs and Wav URLs created by a user."""
    if not BaseGETApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    
    result = await BaseGETApi.subclasses[0]().user_id_get(user_id)
    
    if isinstance(result, Response):
        return result
    
    if isinstance(result, GetVideoIDAndWavURLResponse):
        return JSONResponse(content=result.dict(), status_code=200)
    if isinstance(result, ErrorResponse400):
        return JSONResponse(content=result.dict(), status_code=400)
    
    raise HTTPException(status_code=500, detail="Unexpected response type")

