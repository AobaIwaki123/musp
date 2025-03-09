# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse


class BaseUserApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseUserApi.subclasses = BaseUserApi.subclasses + (cls,)

    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> PostUserResponse:
        """ユーザー情報を登録します。"""
        ...
