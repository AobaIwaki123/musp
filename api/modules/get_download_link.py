import datetime
import os

from google.cloud import storage
from google.oauth2 import service_account
from models.job import Job


def get_download_link(job: Job) -> str:
    job_id = job.job_id
    bucket_name = "musp"
    blob_name = f"{job_id}/vocals.wav"

    url = generate_download_signed_url_v4(bucket_name, blob_name)

    return url


def generate_download_signed_url_v4(
    bucket_name, blob_name, expiration_minutes=15
):
    """指定したバケットとオブジェクトの署名付きURL（ダウンロード用）を生成します。

    Args:
        bucket_name (str): GCSバケット名
        blob_name (str): オブジェクト名
        expiration_minutes (int, optional): URLの有効期限（分）。デフォルトは15分です。

    Returns:
        str: 署名付きURL
    """
    credential_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    credentials = (
        service_account.Credentials.from_service_account_file(
            credential_path
        )
    )

    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=expiration_minutes),
        method="GET",
    )

    return url
