import logging
import os
from typing import Optional

from google.cloud import bigquery
from google.oauth2 import service_account
from google.cloud import storage

BUCKET_NAME = "musp-dev"
BQ_PROJECT = "zennaihackason"
BQ_DATASET = "musp_v3"
BQ_STATUS_TABLE = "videoID-status"

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)

# ロギング設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def check_is_inst_wav_url_exist():
    credentials: Optional[service_account.Credentials] = (
        None
    )
    if CREDENTIAL_PATH and os.path.exists(CREDENTIAL_PATH):
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIAL_PATH
        )

    bq_client = bigquery.Client(
        credentials=credentials, project=BQ_PROJECT
    )

    query: str = f"""
        SELECT videoID FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_STATUS_TABLE}`
    """
    query_job = bq_client.query(query)

    video_ids = [row.videoID for row in query_job]

    if CREDENTIAL_PATH and os.path.exists(CREDENTIAL_PATH):
        logging.info(
            "Using service account credentials from file."
        )
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIAL_PATH
        )
        storage_client = storage.Client(
            credentials=credentials
        )
    else:
        logging.info(
            "Using default application credentials."
        )
        storage_client = storage.Client()

    for video_id in video_ids:
        blob_name = f"{video_id}/no_vocals.wav"

        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(blob_name)

        # ファイルが存在するか確認
        if not blob.exists():
            logging.warning(
                f"Blob {blob_name} does not exist in bucket {BUCKET_NAME}."
            )



if __name__ == "__main__":
    check_is_inst_wav_url_exist()
