import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from google.cloud import storage
from models.job import Job


def upload_source(job: Job) -> bool:
    job_id = job.job_id
    source_path = f"tmp/{job_id}/separated/htdemucs/source/vocals.wav"

    bucket_name = "musp"
    destination_blob_name = f"{job_id}/vocals.wav"

    upload_blob(bucket_name, source_path, destination_blob_name)

    return True


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

if __name__ == "__main__":
    result = upload_blob(
        "musp",
        "tmp/67b121dc-2ecd-48e5-9c09-888b08ec1433/separated/htdemucs/source/vocals.wav",
        "kunugi/test3.wav",
    )
