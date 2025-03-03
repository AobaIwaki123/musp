from typing import Optional

from pydantic import BaseModel


class JobResponse(BaseModel):
    job_id: str
    status: str
    youtube_url: str
    s3_url: Optional[str] = None
    created_at: str
    updated_at: str
