import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from datetime import datetime
from time import sleep  # noqa: F401

from celery_app.celery_app import app
from models.job import Job
from models.job_status import JobStatus
from modules.fetch_source import fetch_source
from modules.get_download_link import get_download_link
from modules.separate_source import separate_source
from modules.upload_source import upload_source


@app.task(bind=True)
def job_task(self, youtube_url: str) -> dict:
    self.update_state(state=JobStatus.PENDING)
    job = Job.create(
        job_id=self.request.id,
        youtube_url=youtube_url,
    )
    self.update_state(state=JobStatus.FETCHING, meta=job.to_dict())
    print("fetching source")
    fetch_source(job)
    print("fetched source")
    # sleep(5)
    self.update_state(state=JobStatus.PROCESSING, meta=job.to_dict())
    print("separating source")
    separate_source(job)
    print("separated source")
    # sleep(5)
    self.update_state(state=JobStatus.UPLOADING, meta=job.to_dict())
    print("uploading source")
    upload_source(job)
    print("uploaded source")
    # sleep(5)
    url = get_download_link(job)
    # url = "new_url"
    job.update_download_link(url)
    self.update_state(state=JobStatus.COMPLETED, meta=job.to_dict())
    return job.to_dict()
