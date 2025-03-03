from pydantic import BaseModel, HttpUrl


# リクエストモデル
class JobCreateRequest(BaseModel):
    youtube_url: HttpUrl
