from celery.result import AsyncResult
from celery_server.celery_app import app
from google.cloud import storage
from openapi_server.models.custom.task_status import TaskStatus


@app.task(bind=True)
def upload_source(self, data: dict) -> dict:
    """クラウドストレージにアップロード"""
    root_task_id = data["root_task_id"]
    root_task = AsyncResult(root_task_id)
    root_task.backend.store_result(
        root_task_id,
        {"step": "Uploading to cloud", "progress": 80},
        state=TaskStatus.STARTED.value,
    )

    source_path = (
        f"tmp/{root_task_id}/separated/htdemucs/source/vocals.wav"
    )

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Uploading to cloud", "progress": 80},
    )

    # 仮のアップロード処理
    bucket_name = "musp"
    destination_blob_name = f"{root_task_id}/vocals.wav"

    upload_blob(bucket_name, source_path, destination_blob_name)

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Upload completed", "progress": 100},
    )

    root_task.backend.store_result(
        root_task_id,
        {"step": "Upload completed", "progress": 100},
        state=TaskStatus.STARTED.value,
    )
    return {
        "root_task_id": root_task_id,
    }  # 次のタスクへ渡す


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to upload is aborted if the object's
    # generation number does not match your precondition. For a destination
    # object that does not yet exist, set the if_generation_match precondition to 0.
    # If the destination object already exists in your bucket, set instead a
    # generation-match precondition using its generation number.
    generation_match_precondition = 0

    blob.upload_from_filename(
        source_file_name,
        if_generation_match=generation_match_precondition,
    )
