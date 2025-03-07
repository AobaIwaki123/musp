import subprocess
import uuid

from celery_sever.celery_app import app
from openapi_server.models.task_status import TaskStatus


@app.task(bind=True)
def fetch_source(self, youtube_url: str) -> None:
    """YouTubeから音源をダウンロードする"""
    task_id = self.request.id
    out_path = f"tmp/{task_id}/source"

    self.update_state(
        state=TaskStatus.STARTED,
        meta={"step": "Downloading", "progress": 0},
    )

    subprocess.run(
        ["yt-dlp", youtube_url, "-o", out_path],
        capture_output=True,
        text=True,
    )

    self.update_state(
        state=TaskStatus.SUCCESS,
        meta={"step": "Download completed", "progress": 33},
    )

    return None  # 次のタスクへ渡す
