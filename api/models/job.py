from datetime import datetime
from typing import Optional

from models.job_status import JobStatus
from pydantic import BaseModel


class Job(BaseModel):
    job_id: str
    status: JobStatus
    youtube_url: str
    s3_url: Optional[str]
    created_at: datetime
    updated_at: datetime
