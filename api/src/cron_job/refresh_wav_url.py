import concurrent.futures
import logging
import os
import time
from datetime import datetime, timezone
from typing import Optional

from google.cloud import bigquery
from google.oauth2 import service_account
from openapi_server.cloud_storage import get_download_link
from openapi_server.models.custom import TaskStatus

# ロギング設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)
BUCKET_NAME = "musp-dev"
BQ_PROJECT = "zennaihackason"
BQ_DATASET = "musp_v3"
BQ_STATUS_TABLE = "videoID-status"
BQ_WAVURL_TABLE = "videoID-wavURL"
CRON_INTERVAL_MINUTE = int(
    os.getenv("CRON_INTERVAL_MINUTE", 60)
)


def fetch_completed_video_ids() -> list[str]:
    """
    BigQuery から `COMPLETED` ステータスの videoID を取得する。

    Returns:
        list[str]: `COMPLETED` ステータスの videoID のリスト
    """
    logging.info(
        "Fetching completed video IDs from BigQuery..."
    )
    try:
        credentials: Optional[
            service_account.Credentials
        ] = None
        if CREDENTIAL_PATH and os.path.exists(
            CREDENTIAL_PATH
        ):
            credentials = service_account.Credentials.from_service_account_file(
                CREDENTIAL_PATH
            )
        bq_client = bigquery.Client(
            credentials=credentials, project=BQ_PROJECT
        )

        query: str = f"""
            SELECT videoID FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_STATUS_TABLE}`
            WHERE status = '{TaskStatus.COMPLETED.value}'
        """
        query_job = bq_client.query(query)
        video_ids = [row.videoID for row in query_job]

        logging.info(
            f"Fetched {len(video_ids)} completed video IDs."
        )
        return video_ids
    except Exception as e:
        logging.error(f"Error fetching video IDs: {e}")
        return []


def process_video_id(video_id: str, duration: int) -> None:
    """
    指定された videoID に対して署名付き URL を生成し、
    BigQuery に保存する。

    Args:
        video_id (str): 署名付き URL を生成する対象の videoID
        duration (int): URL の有効期限（分）
    """
    try:
        logging.info(f"Processing video ID: {video_id}")

        blob_name: str = f"{video_id}/vocals.wav"
        wav_url: Optional[str] = get_download_link(
            BUCKET_NAME,
            blob_name,
            expiration_minutes=duration,
        )

        if not wav_url:
            logging.warning(
                f"Failed to generate URL for videoID {video_id}"
            )
            return

        logging.info(
            f"Generated URL for {video_id}: {wav_url}"
        )

        credentials: Optional[
            service_account.Credentials
        ] = None
        if CREDENTIAL_PATH and os.path.exists(
            CREDENTIAL_PATH
        ):
            credentials = service_account.Credentials.from_service_account_file(
                CREDENTIAL_PATH
            )
        bq_client = bigquery.Client(
            credentials=credentials, project=BQ_PROJECT
        )

        table_id: str = (
            f"{BQ_PROJECT}.{BQ_DATASET}.{BQ_WAVURL_TABLE}"
        )
        now_utc = datetime.now(timezone.utc)

        query: str = f"""
            MERGE `{table_id}` AS target
            USING (SELECT @video_id AS videoID, @wav_url AS wavURL, @created_at AS createdAt, @updated_at AS updatedAt) AS source
            ON target.videoID = source.videoID
            WHEN MATCHED THEN
                UPDATE SET target.wavURL = source.wavURL, target.updatedAt = source.updatedAt
            WHEN NOT MATCHED THEN
                INSERT (videoID, wavURL, createdAt, updatedAt)
                VALUES (source.videoID, source.wavURL, source.createdAt, source.updatedAt)
        """

        query_parameters = [
            bigquery.ScalarQueryParameter(
                "video_id", "STRING", video_id
            ),
            bigquery.ScalarQueryParameter(
                "wav_url", "STRING", wav_url
            ),
            bigquery.ScalarQueryParameter(
                "created_at", "TIMESTAMP", now_utc
            ),
            bigquery.ScalarQueryParameter(
                "updated_at", "TIMESTAMP", now_utc
            ),
        ]

        logging.info(f"Executing BigQuery for {video_id}")

        job_config = bigquery.QueryJobConfig(
            query_parameters=query_parameters
        )
        job = bq_client.query(query, job_config=job_config)
        job.result()  # 確実にクエリが完了するようにする

        logging.info(
            f"Successfully updated BigQuery for {video_id}"
        )

    except Exception as e:
        logging.error(
            f"Error processing video ID {video_id}: {e}"
        )


def refresh_wav_url(duration: int = 60) -> None:
    """
    BigQuery から `COMPLETED` ステータスの videoID を取得し、
    各 videoID に対して署名付き URL を生成して BigQuery に保存する。

    Args:
        duration (int, optional): 生成する署名付き URL の有効期限（分）。デフォルトは 60 分。
    """
    video_ids: list[str] = fetch_completed_video_ids()
    if not video_ids:
        logging.info("No video IDs to process.")
        return

    with (
        concurrent.futures.ThreadPoolExecutor() as executor
    ):
        executor.map(
            lambda vid: process_video_id(vid, duration),
            video_ids,
        )


if __name__ == "__main__":
    while True:
        logging.info("Starting refresh_wav_url job...")
        try:
            refresh_wav_url(
                duration=CRON_INTERVAL_MINUTE + 5
            )  # 5分追加
        except Exception as e:
            logging.error(f"Error in cron job: {e}")
        logging.info(
            f"Sleeping for {CRON_INTERVAL_MINUTE} minutes before next run..."
        )
        time.sleep(CRON_INTERVAL_MINUTE * 60)
