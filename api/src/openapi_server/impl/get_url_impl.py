from openapi_server.apis.get_url_api_base import BaseGetURLApi
from openapi_server.tasks.get_info_by_user_id import (
    get_info_by_user_id,
)


class GetURLImpl(BaseGetURLApi):
    async def info_user_id_get(
        self,
        user_id: str,
    ):
        return get_info_by_user_id(user_id)

    async def thumbnail_job_id_get(
        self,
        job_id: str,
    ):
        raise NotImplementedError

    async def url_job_id_get(
        self,
        job_id: str,
    ):
        raise NotImplementedError
