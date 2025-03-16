# coding: utf-8

from typing import ClassVar, Dict, List, Tuple, Union  # noqa: F401

from pydantic import Field
from typing_extensions import Annotated
from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.get_video_id_and_wav_url_response import GetVideoIDAndWavURLResponse
from openapi_server.security_api import get_token_ApiKeyAuth

class BaseGETApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseGETApi.subclasses = BaseGETApi.subclasses + (cls,)

    async def user_id_get(
        self,
        user_id: Annotated[str, Field(strict=True, description="User ID")],
    ) -> Union[GetVideoIDAndWavURLResponse, ErrorResponse400]:
        """Retrieves a list of YouTube IDs and Wav URLs created by a user."""
        ...

