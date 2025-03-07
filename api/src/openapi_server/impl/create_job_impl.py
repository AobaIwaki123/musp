from openapi_server.models.jobs_post201_response import JobsPost201Response
from openapi_server.models.jobs_post_request import JobsPostRequest
from openapi_server.apis.create_job_api_base import BaseCreateJobApi


class CreateJobImpl(BaseCreateJobApi):
    async def jobs_post(
        self,
        jobs_post_request: JobsPostRequest,
    ):
        return JobsPost201Response.from_dict(
            {
                "job_id": "job_id",
                "message": "New Job Created!",
            }
        )
