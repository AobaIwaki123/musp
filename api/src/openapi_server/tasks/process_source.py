from celery import chain, group
from celery_server.celery_app import app
from openapi_server.models.custom.task_status import TaskStatus
from openapi_server.models.post_jobs_request import PostJobsRequest
from openapi_server.tasks.fetch_source import fetch_source
from openapi_server.tasks.separate_source import separate_source
from openapi_server.tasks.upload_metadata import process_youtube_metadata
from openapi_server.tasks.upload_source import upload_source


@app.task(bind=True)
def process_source(self, data: dict) -> str:
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""
    root_task_id = self.request.id

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Processing audio", "progress": 0},
    )

    parallel_tasks = group(
        chain(
            fetch_source.s(data, root_task_id),
            separate_source.s(),
            upload_source.s(),
        ),
        process_youtube_metadata.s(data, root_task_id),
    )
    parallel_tasks.apply_async()

    return root_task_id
