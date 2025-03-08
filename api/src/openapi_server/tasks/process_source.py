from celery import chain
from celery_server.celery_app import app
from openapi_server.tasks.fetch_source import fetch_source
from openapi_server.tasks.separate_source import separate_source
from openapi_server.tasks.upload_source import upload_source
from openapi_server.models.custom.task_status import TaskStatus

@app.task(bind=True)
def process_audio(self, youtube_url: str) -> str:
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""
    root_task_id = self.request.id

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Processing audio", "progress": 0},
    )

    workflow = chain(
        fetch_source.s(youtube_url, root_task_id),
        separate_source.s(),
        upload_source.s(),
    )
    workflow.apply_async()

    return root_task_id
