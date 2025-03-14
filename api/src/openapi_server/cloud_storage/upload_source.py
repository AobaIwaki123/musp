from celery_server.celery_app import app
from openapi_server.cloud_storage.upload_blob import (
    upload_blob,
)
from openapi_server.models.custom.task_status import (
    TaskStatus,
)


@app.task(bind=True)
def upload_source(self, bucket_name, video_id: str):
    """クラウドストレージにアップロード"""
    source_path = f"tmp/{video_id}/separated/htdemucs/source/vocals.wav"

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Uploading to cloud"},
    )

    # 仮のアップロード処理
    destination_blob_name = f"{video_id}/vocals.wav"

    upload_blob(
        bucket_name, source_path, destination_blob_name
    )

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Upload completed"},
    )
