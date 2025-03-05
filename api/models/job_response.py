from typing import Optional

from pydantic import BaseModel


class JobResponse(BaseModel):
    job_id: str
    status: str
    youtube_url: str
    download_link: Optional[str] = None
    created_at: str
    updated_at: str
