from openapi_server.apis.user_api_base import BaseUserApi
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse
from openapi_server.tasks.check_or_create_user import UserManager

user_manager = UserManager(
    project_id="zennaihackason",
    dataset_id="musp",
    table_id="users",
)


class UserApiImpl(BaseUserApi):
    async def users_post(
        self, post_user_request: PostUserRequest
    ) -> PostUserResponse:
        user_id = user_manager.check_and_create_user(
            post_user_request.google_id,
            post_user_request.nickname,
            post_user_request.icon_url,
        )
        return PostUserResponse(user_id=user_id)
