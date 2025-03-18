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

# 新しいテーブル名
BQ_VOCAL_WAV_TABLE = "videoID-vocalWavURL"
BQ_INST_WAV_TABLE = "videoID-instWavURL"

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
            SELECT videoID FROM `{BQ_PROJECT}.{BQ_DATASET}.videoID-status`
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


def process_video_files(
    video_id: str, duration: int
) -> None:
    """
    指定された videoID に対して `vocals.wav` と `no_vocals.wav` の
    署名付き URL を生成し、それぞれ BigQuery に保存する。

    Args:
        video_id (str): 署名付き URL を生成する対象の videoID
        duration (int): URL の有効期限（分）
    """
    try:
        logging.info(f"Processing video ID: {video_id}")

        # それぞれのファイルの URL を生成
        vocals_blob_name = f"{video_id}/vocals.wav"
        no_vocals_blob_name = f"{video_id}/no_vocals.wav"

        vocals_wav_url = get_download_link(
            BUCKET_NAME,
            vocals_blob_name,
            expiration_minutes=duration,
        )
        no_vocals_wav_url = get_download_link(
            BUCKET_NAME,
            no_vocals_blob_name,
            expiration_minutes=duration,
        )

        # 認証情報の設定
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
        now_utc = datetime.now(timezone.utc)

        # `videoID-vocalWavURL` に vocals.wav の URL を保存
        if vocals_wav_url:
            table_id_vocal = f"{BQ_PROJECT}.{BQ_DATASET}.{BQ_VOCAL_WAV_TABLE}"
            query_vocal = f"""
                MERGE `{table_id_vocal}` AS target
                USING (SELECT @video_id AS videoID, @wav_url AS wavURL, @created_at AS createdAt, @updated_at AS updatedAt) AS source
                ON target.videoID = source.videoID
                WHEN MATCHED THEN
                    UPDATE SET target.wavURL = source.wavURL, target.updatedAt = source.updatedAt
                WHEN NOT MATCHED THEN
                    INSERT (videoID, wavURL, createdAt, updatedAt)
                    VALUES (source.videoID, source.wavURL, source.createdAt, source.updatedAt)
            """
            job_config_vocal = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter(
                        "video_id", "STRING", video_id
                    ),
                    bigquery.ScalarQueryParameter(
                        "wav_url", "STRING", vocals_wav_url
                    ),
                    bigquery.ScalarQueryParameter(
                        "created_at", "TIMESTAMP", now_utc
                    ),
                    bigquery.ScalarQueryParameter(
                        "updated_at", "TIMESTAMP", now_utc
                    ),
                ]
            )
            logging.info(
                f"Updating BigQuery (vocals) for {video_id}"
            )
            job_vocal = bq_client.query(
                query_vocal, job_config=job_config_vocal
            )
            job_vocal.result()

        # `videoID-instWavURL` に no_vocals.wav の URL を保存
        if no_vocals_wav_url:
            table_id_inst = f"{BQ_PROJECT}.{BQ_DATASET}.{BQ_INST_WAV_TABLE}"
            query_inst = f"""
                MERGE `{table_id_inst}` AS target
                USING (SELECT @video_id AS videoID, @wav_url AS wavURL, @created_at AS createdAt, @updated_at AS updatedAt) AS source
                ON target.videoID = source.videoID
                WHEN MATCHED THEN
                    UPDATE SET target.wavURL = source.wavURL, target.updatedAt = source.updatedAt
                WHEN NOT MATCHED THEN
                    INSERT (videoID, wavURL, createdAt, updatedAt)
                    VALUES (source.videoID, source.wavURL, source.createdAt, source.updatedAt)
            """
            job_config_inst = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter(
                        "video_id", "STRING", video_id
                    ),
                    bigquery.ScalarQueryParameter(
                        "wav_url",
                        "STRING",
                        no_vocals_wav_url,
                    ),
                    bigquery.ScalarQueryParameter(
                        "created_at", "TIMESTAMP", now_utc
                    ),
                    bigquery.ScalarQueryParameter(
                        "updated_at", "TIMESTAMP", now_utc
                    ),
                ]
            )
            logging.info(
                f"Updating BigQuery (no_vocals) for {video_id}"
            )
            job_inst = bq_client.query(
                query_inst, job_config=job_config_inst
            )
            job_inst.result()

        logging.info(
            f"Successfully updated BigQuery for {video_id}"
        )

    except Exception as e:
        logging.error(
            f"Error processing video ID {video_id}: {e}"
        )


def refresh_wav_urls(duration: int = 60) -> None:
    """
    `COMPLETED` ステータスの videoID を取得し、
    `vocals.wav` / `no_vocals.wav` の署名付き URL を生成して BigQuery に保存する。

    Args:
        duration (int, optional): 生成する署名付き URL の有効期限（分）。デフォルトは 60 分。
    """
    video_ids = fetch_completed_video_ids()
    if not video_ids:
        logging.info("No video IDs to process.")
        return

    with (
        concurrent.futures.ThreadPoolExecutor() as executor
    ):
        executor.map(
            lambda vid: process_video_files(vid, duration),
            video_ids,
        )


if __name__ == "__main__":
    while True:
        logging.info("Starting refresh_wav_url job...")
        try:
            refresh_wav_urls(
                duration=CRON_INTERVAL_MINUTE + 5
            )
        except Exception as e:
            logging.error(f"Error in cron job: {e}")
        logging.info(
            f"Sleeping for {CRON_INTERVAL_MINUTE} minutes before next run..."
        )
        time.sleep(CRON_INTERVAL_MINUTE * 60)
