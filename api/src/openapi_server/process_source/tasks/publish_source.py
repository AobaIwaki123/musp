from celery_server.celery_app import app
from cron_job import process_video_id
from openapi_server.models.custom.task_status import (
    TaskStatus,
)
from openapi_server.utils.normalize_youtube_url import (
    get_youtube_video_id,
)


@app.task(bind=True)
def publish_source(self, data: dict) -> dict:
    video_id = get_youtube_video_id(data["youtube_url"])

    self.update_state(
        state=TaskStatus.PROCESSING.value,
        meta={"step": "Publishing source"},
    )

    process_video_id(video_id, duration=60)

    self.update_state(
        state=TaskStatus.COMPLETED.value,
        meta={"step": "Publishing completed"},
    )
    return data
