import concurrent.futures
import os
import time
import logging
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
BUCKET_NAME = "musp-dev"  # バケット名を指定
BQ_PROJECT = "zennaihackason"  # BigQuery プロジェクト ID
BQ_DATASET = "musp_v3"  # BigQuery データセット名
BQ_STATUS_TABLE = "videoID-status"
BQ_WAVURL_TABLE = "videoID-wavURL"
CRON_INTERVAL_MINUTE = int(
    os.getenv("CRON_INTERVAL_MINUTE", 60)
)


def fetch_completed_video_ids() -> list[str]:
    """BigQuery から TaskStatus.COMPLETED の videoID を取得する。

    Returns:
        list[str]: COMPLETED の videoID のリスト。
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
    """指定された videoID の署名付き URL を生成し、BigQuery に保存する。

    Args:
        video_id (str): 署名付き URL を生成する対象の videoID。
        duration (int): URL の有効期限（分）。
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
                f"No URL generated for {video_id}. Skipping..."
            )
            return

        logging.info(
            f"Generated signed URL for {video_id}: {wav_url}"
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
        now_utc = datetime.now(timezone.utc).isoformat()
        query: str = f"""
            INSERT INTO `{table_id}` (videoID, wavURL, createdAt, updatedAt)
            VALUES ('{video_id}', '{wav_url}', '{now_utc}', '{now_utc}')
            ON DUPLICATE KEY UPDATE wavURL = VALUES(wavURL), updatedAt = '{now_utc}'
        """
        bq_client.query(query)
        logging.info(
            f"Inserted/Updated {video_id} in BigQuery."
        )
    except Exception as e:
        logging.error(
            f"Error processing video ID {video_id}: {e}"
        )


def refresh_wav_url(duration: int = 60) -> None:
    """BigQuery から COMPLETED の videoID を取得し、
    各 videoID ごとに署名付き URL を生成して BigQuery に保存する処理を並行実行する。

    Args:
        duration (int, optional): 生成する署名付き URL の有効期限（分）。デフォルトは 60 分。
    """
    logging.info("Starting refresh_wav_url job...")
    video_ids: list[str] = fetch_completed_video_ids()

    if not video_ids:
        logging.warning(
            "No completed video IDs found. Exiting job."
        )
        return

    with (
        concurrent.futures.ThreadPoolExecutor() as executor
    ):
        executor.map(
            lambda vid: process_video_id(vid, duration),
            video_ids,
        )
    logging.info("Completed refresh_wav_url job.")


if __name__ == "__main__":
    logging.info("Starting cron job...")
    try:
        refresh_wav_url(CRON_INTERVAL_MINUTE)
    except Exception as e:
        logging.error(f"Critical error in cron job: {e}")
