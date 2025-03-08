import subprocess

from celery_server.celery_app import app
from openapi_server.models.custom.task_status import TaskStatus
from celery.result import AsyncResult
from openapi_server.models.custom.task_status import TaskStatus

@app.task(bind=True)
def separate_source(self, data: dict) -> dict:
    """音源をボーカルと伴奏に分離する"""
    root_task_id = data["root_task_id"]
    root_task = AsyncResult(root_task_id)
    root_task.backend.store_result(
        root_task_id, {"step": "Separating audio", "progress": 50},
        state=TaskStatus.STARTED.value,
    )

    source_path = f"tmp/{root_task_id}/source.webm"
    out_path = f"tmp/{root_task_id}/separated"

    self.update_state(
        state=TaskStatus.STARTED.value,
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
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Separation completed", "progress": 66},
    )

    root_task.backend.store_result(
        root_task_id, {"step": "Separation completed", "progress": 66},
        state=TaskStatus.STARTED.value,
    )

    return {
        "root_task_id": root_task_id,
    }  # 次のタスクへ渡す
