import re
from pydantic import BaseModel, Field, field_validator

class PostVideoRequest(BaseModel):
    user_id: str = Field(..., description="User ID", alias="user_id")
    youtube_url: str = Field(..., description="YouTube video link", alias="youtube_url")

    @field_validator('youtube_url')
    @classmethod
    def validate_youtube_url(cls, v: str) -> str:
        # Regex to match youtube.com or youtu.be URLs and extract 11 char ID
        pattern = r"^(?:https?://)?(?:www\.)?(?:youtube\.com/(?:watch\?.*v=|embed/|v/)|youtu\.be/)([a-zA-Z0-9_-]{11})"
        if not re.match(pattern, v):
             raise ValueError("Invalid YouTube URL")
        return v

class PostVideoResponse(BaseModel):
    status_code: int
    status_message: str
    youtube_id: str
