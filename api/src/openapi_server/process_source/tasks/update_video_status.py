import os

from celery_server.celery_app import app
from openapi_server.big_query import insert_video_status
from openapi_server.models.custom.task_status import (
    TaskStatus,
)
from openapi_server.utils.normalize_youtube_url import (
    get_youtube_video_id,
)

GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
DATASET_ID = os.getenv("DATASET_ID")
TABLE_ID = "videoID-status"


@app.task(bind=True)
def update_video_status(
    self, data: dict, status: str
) -> dict:
    video_id = get_youtube_video_id(data["youtube_url"])

    """動画のステータスを更新する"""
    self.update_state(
        state=TaskStatus.PROCESSING.value,
        meta={"step": "Updating video status"},
    )

    insert_video_status(
        project_id=GOOGLE_CLOUD_PROJECT,
        dataset_id=DATASET_ID,
        table_id=TABLE_ID,
        video_id=video_id,
        status=status,
    )

    self.update_state(
        state=TaskStatus.COMPLETED.value,
        meta={
            "step": "Video status updated",
        },
    )

    return data
