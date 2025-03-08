from openapi_server.apis.create_job_api_base import BaseCreateJobApi
from openapi_server.models.post_jobs_request import PostJobsRequest
from openapi_server.models.post_jobs_response import PostJobsResponse
from openapi_server.tasks.process_source import process_audio


class CreateJobImpl(BaseCreateJobApi):
    async def jobs_post(
        self,
        jobs_post_request: PostJobsRequest,
    ):
        result = process_audio.delay(
            str(jobs_post_request.youtube_url)
        )
        return PostJobsResponse.from_dict(
            {
                "job_id": result.id,
                "message": "New Job Created!",
            }
        )
