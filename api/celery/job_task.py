import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from datetime import datetime
from time import sleep

from celery_app import app
from models.job import Job
from models.job_status import JobStatus
from pydantic import HttpUrl


@app.task(bind=True)
def job_task(self, youtube_url: HttpUrl) -> Job:
    download_link = None
    return Job(
        job_id=self.id,
        status=JobStatus.PENDING,
        youtube_url=youtube_url,
        download_link=download_link,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ).model_dump()


@app.task(bind=True)
def sample_task(self, x: int, y: int) -> dict[str, int]:
    self.update_state(state="RUNNING")
    print("Task is running...")
    sleep(1)
    result = x + y  # 実際のタスク処理
    return {"result": result}
