import os

from celery import chain
from openapi_server.process_source.tasks import (
    fetch_source,
    post_run,
    separate_source,
    update_video_status,
    upload_source,
)
from openapi_server.utils import (
    get_youtube_video_id,
    normalize_youtube_url,
)
from openapi_server.big_query import is_video_exists
from celery_server.celery_app import app
from openapi_server.models.custom import TaskStatus

GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
DATASET_ID = os.getenv("DATASET_ID")


@app.task(bind=True)
def process_source(self, data: dict) -> str:
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""

    normalized_url = normalize_youtube_url(
        data["youtube_url"]
    )
    if not normalized_url:
        raise ValueError("Invalid YouTube URL")

    data["youtube_url"] = normalized_url
    video_id = get_youtube_video_id(normalized_url)
    TABLE_ID = "videoID-status"

    if is_video_exists(
        project_id=GOOGLE_CLOUD_PROJECT,
        dataset_id=DATASET_ID,
        table_id=TABLE_ID,
        video_id=video_id,
    ):
        return "The video already exists."

    # Celeryの処理チェーンを作成
    task_chain = chain(
        update_video_status.s(
            data, TaskStatus.PROCESSING.value
        ),
        fetch_source.s(),
        separate_source.s(),
        upload_source.s(),
        post_run.s(),
        update_video_status.s(TaskStatus.COMPLETED.value),
    )
    # 非同期実行

    result = task_chain.apply_async()
    return result.id  # CeleryタスクのIDを返す
