from openapi_server.models.jobs_post201_response import JobsPost201Response
from openapi_server.models.jobs_post_request import JobsPostRequest
from openapi_server.apis.create_job_api_base import BaseCreateJobApi
from openapi_server.tasks.process_source import process_audio

class CreateJobImpl(BaseCreateJobApi):
    async def jobs_post(
        self,
        jobs_post_request: JobsPostRequest,
    ):
        id = process_audio(jobs_post_request.youtube_url)
        return JobsPost201Response.from_dict(
            {
                "job_id": id,
                "message": "New Job Created!",
            }
        )
