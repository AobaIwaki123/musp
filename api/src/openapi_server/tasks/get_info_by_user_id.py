import datetime
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor

from google.cloud import bigquery, storage
from google.oauth2 import service_account
from openapi_server.models.get_info_list_response import (
    GetInfoListResponse,
)
from openapi_server.models.get_info_response import GetInfoResponse


def generate_download_signed_url_v4(
    bucket_name, blob_name, expiration_minutes=60
):
    """GCSのオブジェクトに対する署名付きURL（ダウンロード用）を生成"""

    credential_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if credential_path and os.path.exists(credential_path):
        credentials = (
            service_account.Credentials.from_service_account_file(
                credential_path
            )
        )
        storage_client = storage.Client(credentials=credentials)
    else:
        storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    # ファイルが存在するか確認
    if not blob.exists():
        return None  # 存在しない場合は None を返す

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=expiration_minutes),
        method="GET",
    )

    return url


def get_metadata_from_gcs(bucket_name, blob_name):
    """Cloud Storage から metadata.json を取得し、JSON 形式で返す"""
    credential_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if credential_path and os.path.exists(credential_path):
        credentials = (
            service_account.Credentials.from_service_account_file(
                credential_path
            )
        )
        storage_client = storage.Client(credentials=credentials)
    else:
        storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    try:
        metadata_content = blob.download_as_text()
        return json.loads(metadata_content)  # JSON に変換
    except Exception as e:
        return {"error": f"Failed to fetch metadata: {str(e)}"}


def fetch_music_info(
    root_task_id, dataset_id, task_titles_table, bucket_name
):
    """1つの root_task_id に対応する音楽情報を取得する処理"""
    client = bigquery.Client()

    # タイトル取得
    query = f"""
    SELECT youtube_title FROM `{dataset_id}.{task_titles_table}`
    WHERE root_task_id = @root_task_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter(
                "root_task_id", "STRING", root_task_id
            )
        ]
    )
    result = client.query(query, job_config=job_config).result()
    youtube_title = next(result, {}).get(
        "youtube_title", "Unknown Title"
    )

    # metadata.json を取得
    metadata_blob_name = f"{root_task_id}/metadata.json"
    metadata = get_metadata_from_gcs(bucket_name, metadata_blob_name)

    # wav ファイルの署名付きURLを取得
    wav_blob_name = f"{root_task_id}/vocals.wav"
    wav_url = generate_download_signed_url_v4(
        bucket_name, wav_blob_name
    )

    # wav_url が None の場合は null を設定
    return GetInfoResponse(
        title=youtube_title,
        thumbnail_url=metadata.get("thumbnail", ""),
        wav_url=wav_url if wav_url else None,
    )


def get_info_by_user_id(
    user_id,
    dataset_id="musp",
    user_tasks_table="user_tasks",
    task_titles_table="task_titles",
    bucket_name="musp",
) -> GetInfoListResponse:
    start_time = time.time()
    print("start get_user_music")

    """ユーザーIDを元に root_task_id を取得し、曲情報を並列処理で取得する"""
    client = bigquery.Client()

    # root_task_id を取得
    query = f"""
    SELECT root_task_id FROM `{dataset_id}.{user_tasks_table}`
    WHERE user_id = @user_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter(
                "user_id", "STRING", user_id
            )
        ]
    )

    results = client.query(query, job_config=job_config).result()
    root_task_ids = [row.root_task_id for row in results]

    if not root_task_ids:
        return GetInfoListResponse(items=[])

    # 並列処理で root_task_id ごとのデータを取得
    with ThreadPoolExecutor() as executor:
        music_list = list(
            executor.map(
                lambda task_id: fetch_music_info(
                    task_id,
                    dataset_id,
                    task_titles_table,
                    bucket_name,
                ),
                root_task_ids,
            )
        )

    print(f"Processing time: {time.time() - start_time} sec")
    return GetInfoListResponse(items=music_list)
