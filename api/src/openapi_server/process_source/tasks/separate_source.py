import subprocess

from celery_server.celery_app import app
from openapi_server.models.custom.task_status import (
    TaskStatus,
)
from openapi_server.utils.normalize_youtube_url import (
    get_youtube_video_id,
)


@app.task(bind=True)
def separate_source(self, data: dict) -> dict:
    youtube_url = data["youtube_url"]
    video_id = get_youtube_video_id(youtube_url)

    """音源をボーカルと伴奏に分離する"""
    source_path = f"tmp/{video_id}/source.webm"
    out_path = f"tmp/{video_id}/separated"

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Separating audio"},
    )

    subprocess.run(
        [
            "demucs",
            "--two-stems",
            "vocals",
            source_path,
            "-o",
            out_path,
        ],
        capture_output=True,
        text=True,
    )

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={
            "step": "Separation completed",
        },
    )

    return data
