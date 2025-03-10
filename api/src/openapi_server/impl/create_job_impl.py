from openapi_server.apis.create_job_api_base import BaseCreateJobApi
from openapi_server.models.post_jobs_request import PostJobsRequest
from openapi_server.models.post_jobs_response import PostJobsResponse
from openapi_server.tasks.process_source import process_source


class CreateJobImpl(BaseCreateJobApi):
    async def jobs_post(
        self,
        jobs_post_request: PostJobsRequest,
    ):
        process_source_s = process_source.s(
            jobs_post_request.to_dict()
        )
        result = process_source_s.apply_async()
        return PostJobsResponse(
            job_id=result.id, message="Job created"
        )
