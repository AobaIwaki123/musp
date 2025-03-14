from celery_server.celery_app import app
from openapi_server.cloud_storage.upload_blob import (
    upload_blob,
)
from openapi_server.models.custom.task_status import (
    TaskStatus,
)
from openapi_server.utils.normalize_youtube_url import (
    get_youtube_video_id,
)

BUCKET_NAME = "musp-dev"


@app.task(bind=True)
def upload_source(self, data: dict) -> dict:
    youtube_url = data["youtube_url"]
    video_id = get_youtube_video_id(youtube_url)

    """クラウドストレージにアップロード"""
    source_path = f"tmp/{video_id}/separated/htdemucs/source/vocals.wav"

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Uploading to cloud"},
    )

    # 仮のアップロード処理
    destination_blob_name = f"{video_id}/vocals.wav"

    upload_blob(
        BUCKET_NAME, source_path, destination_blob_name
    )

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Upload completed"},
    )

    return data
