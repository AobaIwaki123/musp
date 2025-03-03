from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Job(BaseModel):
    job_id: str
    status: str
    youtube_url: str
    s3_url: Optional[str]
    created_at: datetime
    updated_at: datetime
