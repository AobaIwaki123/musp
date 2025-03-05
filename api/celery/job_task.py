import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from datetime import datetime
from time import sleep  # noqa: F401

from celery_app import app
from models.job import Job
from models.job_status import JobStatus
from pydantic import HttpUrl


@app.task(bind=True)
def job_task(self, youtube_url: HttpUrl) -> Job:
    self.update_state(state=JobStatus.PENDING)
    job = Job(
        job_id=self.request.id,
        status=JobStatus.PENDING,
        youtube_url=youtube_url,
        download_link=None,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    self.update_state(state=JobStatus.FETCHING)
    # fetch_source(job)
    sleep(5)
    self.update_state(state=JobStatus.PROCESSING)
    # separate_source(job)
    sleep(5)
    self.update_state(state=JobStatus.UPLOADING)
    # upload_source(job)
    sleep(5)
    # url = get_download_link(job)
    url = "new_url"
    job.update_download_link(url)
    self.update_state(state=JobStatus.COMPLETED)
    return job.model_dump()
