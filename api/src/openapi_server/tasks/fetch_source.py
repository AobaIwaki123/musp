import subprocess

from celery_server.celery_app import app
from openapi_server.models.custom.task_status import TaskStatus


@app.task(bind=True)
def fetch_source(self, youtube_url: str, root_task_id: str) -> dict:
    """YouTubeから音源をダウンロードする"""
    out_path = f"tmp/{root_task_id}/source.webm"

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

    return {"root_task_id": root_task_id}
