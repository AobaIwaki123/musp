import os
import datetime
import time
import concurrent.futures
from typing import List, Tuple, Optional
from google.cloud import bigquery
from google.oauth2 import service_account
from openapi_server.cloud_storage import get_download_link
from openapi_server.models.custom import TaskStatus

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)
BUCKET_NAME = "mudp-dev"  # バケット名を指定
BQ_PROJECT = "zennaihackason"  # BigQuery プロジェクト ID
BQ_DATASET = "musp_v3"  # BigQuery データセット名
BQ_STATUS_TABLE = "videoID-status"
BQ_WAVURL_TABLE = "videoID-wavURL"


def fetch_completed_video_ids() -> List[str]:
    """BigQuery から TaskStatus.COMPLETED の videoID を取得する。

    Returns:
        List[str]: COMPLETED の videoID のリスト。
    """
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
        WHERE status = '{TaskStatus.COMPLETED.value}'
    """
    query_job = bq_client.query(query)
    return [row.videoID for row in query_job]


def generate_signed_url(
    video_id: str, duration: int
) -> Tuple[str, Optional[str]]:
    """GCS のオブジェクトに対する署名付き URL（ダウンロード用）を生成する。

    Args:
        video_id (str): 署名付き URL を生成する対象の videoID。
        duration (int): URL の有効期限（分）。

    Returns:
        Tuple[str, Optional[str]]: videoID と生成された署名付き URL（存在しない場合は None）。
    """
    blob_name: str = f"{video_id}/vocals.wav"
    return video_id, get_download_link(
        BUCKET_NAME, blob_name, expiration_minutes=duration
    )


def insert_wav_urls(
    rows_to_insert: List[Tuple[str, str]],
) -> None:
    """生成された wavURL を BigQuery に挿入する。

    Args:
        rows_to_insert (List[Tuple[str, str]]): (videoID, wavURL) のリスト。
    """
    if not rows_to_insert:
        return

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

    table_id: str = (
        f"{BQ_PROJECT}.{BQ_DATASET}.{BQ_WAVURL_TABLE}"
    )
    query: str = f"""
        INSERT INTO `{table_id}` (videoID, wavURL)
        VALUES {", ".join([f"('{v[0]}', '{v[1]}')" for v in rows_to_insert])}
        ON DUPLICATE KEY UPDATE wavURL = VALUES(wavURL)
    """
    bq_client.query(query)


def refresh_wav_url(duration: int = 60) -> None:
    """BigQuery から COMPLETED の videoID を取得し、
    GCS から wavURL を生成し、BigQuery に保存する処理を行う。

    Args:
        duration (int, optional): 生成する署名付き URL の有効期限（分）。デフォルトは 60 分。
    """
    video_ids: List[str] = fetch_completed_video_ids()

    with (
        concurrent.futures.ThreadPoolExecutor() as executor
    ):
        future_to_video = {
            executor.submit(
                generate_signed_url, video_id, duration
            ): video_id
            for video_id in video_ids
        }
        rows_to_insert: List[Tuple[str, str]] = [
            future.result()
            for future in concurrent.futures.as_completed(
                future_to_video
            )
            if future.result()[1]
        ]

    insert_wav_urls(rows_to_insert)


if __name__ == "__main__":
    duration: int = 60  # 認証URLの有効期限（分）
    refresh_wav_url(duration)
    next_run_time: int = duration - 5  # 5分前に再実行
    while True:
        time.sleep(next_run_time * 60)
        refresh_wav_url(duration)
