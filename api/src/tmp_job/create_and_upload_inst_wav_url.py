import os
from typing import Optional

from google.cloud import bigquery
from google.oauth2 import service_account
from openapi_server.process_source import (
    process_source,
)

BQ_PROJECT = "zennaihackason"
BQ_DATASET = "musp_v3"
BQ_STATUS_TABLE = "videoID-status"

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)


def get_youtube_url_from_videoid(video_id: str) -> str:
    return f"https://www.youtube.com/watch?v={video_id}"


def create_and_upload_inst_wav_url():
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

    datas = [
        {
            "youtube_url": get_youtube_url_from_videoid(
                row.videoID
            )
        }
        for row in query_job
    ]

    # Celeryタスクを非同期で実行
    for data in datas:
        process_source.apply_async(args=[data])


if __name__ == "__main__":
    create_and_upload_inst_wav_url()
