from datetime import datetime

from models.job import Job
from models.job_status import JobStatus
from modules.fetch_source import fetch_source
from modules.get_download_link import get_download_link
from modules.separate_source import separate_source
from modules.upload_source import upload_source
from pydantic import HttpUrl


def create_job_hander(job_id: str, youtube_url: HttpUrl) -> Job:
    job = Job(
        job_id=job_id,
        status=JobStatus.PENDING,
        youtube_url=youtube_url,
        s3_url=None,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    print(f"Created job {job_id}")
    fetch_source(job)
    print(f"Fetched source for job {job_id}")
    separate_source(job)
    print(f"Separated source for job {job_id}")
    upload_source(job)
    print(f"Uploaded source for job {job_id}")
    url = get_download_link(job)
    job.update_s3_url(url)
    return job
