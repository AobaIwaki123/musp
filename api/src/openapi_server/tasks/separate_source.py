import subprocess

from celery_sever.celery_app import app
from openapi_server.models.task_status import TaskStatus

@app.task(bind=True)
def separate_audio(self, dummy = None) -> None:
    """音源をボーカルと伴奏に分離する"""
    task_id = self.request.id
    source_path = f"tmp/{task_id}/source.webm"
    out_path = f"tmp/{task_id}/separated"

    self.update_state(
        state=TaskStatus.STARTED,
        meta={"step": "Separating audio", "progress": 50},
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
        state=TaskStatus.SUCCESS,
        meta={"step": "Separation completed", "progress": 66},
    )

    return None
