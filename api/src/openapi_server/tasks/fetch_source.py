import subprocess
import uuid

from celery_server.celery_app import app
from openapi_server.models.task_status import TaskStatus


@app.task(bind=True)
def fetch_source(self, youtube_url: str) -> dict:
    """YouTubeから音源をダウンロードする"""
    task_id = self.request.id
    out_path = f"tmp/{task_id}/source"

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Downloading", "progress": 0},
    )

    # subprocess.run(
    #     ["yt-dlp", youtube_url, "-o", out_path],
    #     capture_output=True,
    #     text=True,
    # )

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Download completed", "progress": 33},
    )

    return {"task_id": task_id}  # 次のタスクへ渡す
