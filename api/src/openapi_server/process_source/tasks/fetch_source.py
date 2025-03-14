import subprocess

from openapi_server.celery_app import app
from openapi_server.models.custom.task_status import (
    TaskStatus,
)
from openapi_server.utils.normalize_youtube_url import (
    get_youtube_video_id,
)


@app.task(bind=True)
def fetch_source(self, data: dict) -> dict:
    youtube_url = data["youtube_url"]
    video_id = get_youtube_video_id(youtube_url)
    
    """YouTubeから音源をダウンロードする"""
    out_path = f"tmp/{video_id}/source.webm"

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Downloading", "progress": 0},
    )

    subprocess.run(
        ["yt-dlp", youtube_url, "-o", out_path],
        capture_output=True,
        text=True,
    )

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Download completed", "progress": 33},
    )

    return data
