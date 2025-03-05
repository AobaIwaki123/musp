import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from datetime import datetime
from typing import Optional

from models.job_status import JobStatus
from pydantic import BaseModel, HttpUrl


class Job(BaseModel):
    job_id: str
    status: JobStatus
    youtube_url: HttpUrl
    download_link: Optional[str]
    created_at: datetime
    updated_at: datetime

    # S3 URLを更新するメソッド
    def update_download_link(self, download_link: str):
        self.download_link = download_link
        self.updated_at = datetime.now()


if __name__ == "__main__":
    job = Job(
        job_id="67b121dc-2ecd-48e5-9c09-888b08ec1433",
        status=JobStatus.PENDING,
        youtube_url="https://www.youtube.com/watch?v=6JYIGclVQdw",
        download_link=None,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    job.update_download_link(
        "https://s3.example.com/67b121dc-2ecd-48e5-9c09-888b08ec1433/vocals.mp3"
    )
    print(job)
