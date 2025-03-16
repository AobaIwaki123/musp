# coding: utf-8

from typing import ClassVar, Dict, List, Tuple, Union  # noqa: F401

from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse
from openapi_server.models.post_video_request import PostVideoRequest
from openapi_server.models.post_video_response import PostVideoResponse
from openapi_server.security_api import get_token_ApiKeyAuth

class BasePOSTApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePOSTApi.subclasses = BasePOSTApi.subclasses + (cls,)

    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> Union[PostUserResponse, ErrorResponse400]:
        """Registers user information."""
        ...



    async def video_post(
        self,
        post_video_request: PostVideoRequest,
    ) -> Union[PostVideoResponse, ErrorResponse400]:
        """Creates a job to download audio from a YouTube link and separate the audio and vocals."""
        ...

