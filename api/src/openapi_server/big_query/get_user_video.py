from google.cloud import bigquery
from openapi_server.models.get_video_id_and_wav_url_response import (
    GetVideoIDAndWavURLResponse,
)
from openapi_server.models.video_id_and_wav_url import (
    VideoIDAndWavURL,
)
from typing import List

BQ_PROJECT = "zennaihackason"  # BigQuery プロジェクト ID
BQ_DATASET = "musp_v3"  # BigQuery データセット名
BQ_USER_VIDEO_TABLE = "userID-videoID"
BQ_VIDEO_VOCAL_WAVURL_TABLE = "videoID-vocalWavURL"
BQ_VIDEO_INST_WAVURL_TABLE = "videoID-instWavURL"


def _build_query(user_id: str) -> str:
    """
    BigQuery 用の SQL クエリを手書きで生成する関数。
    """
    return f"""
        SELECT uv.videoID, vw.wavURL AS vocalWavURL, iw.wavURL AS instWavURL
        FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_USER_VIDEO_TABLE}` AS uv
        LEFT JOIN `{BQ_PROJECT}.{BQ_DATASET}.{BQ_VIDEO_VOCAL_WAVURL_TABLE}` AS vw
        ON uv.videoID = vw.videoID
        LEFT JOIN `{BQ_PROJECT}.{BQ_DATASET}.{BQ_VIDEO_INST_WAVURL_TABLE}` AS iw
        ON uv.videoID = iw.videoID
        WHERE uv.userID = @user_id
    """


def _execute_query(
    query: str, user_id: str
) -> bigquery.table.RowIterator:
    """
    BigQuery のクエリを実行する関数。

    Args:
        query (str): 実行する SQL クエリ。
        user_id (str): 取得するユーザーID。

    Returns:
        bigquery.table.RowIterator: クエリ結果のイテレータ。
    """
    client = bigquery.Client()
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter(
                "user_id", "STRING", user_id
            )
        ]
    )
    query_job = client.query(query, job_config=job_config)
    return query_job.result()


def _parse_results(
    results: bigquery.table.RowIterator,
) -> List[VideoIDAndWavURL]:
    """
    クエリ結果を VideoIDAndWavURL のリストに変換する関数。

    Args:
        results (bigquery.table.RowIterator): クエリ結果。

    Returns:
        List[VideoIDAndWavURL]: VideoIDAndWavURL のリスト。
    """
    return [
        VideoIDAndWavURL(
            youtube_id=row.videoID,
            vocal_wav_url=row.vocalWavURL
            if row.vocalWavURL
            else "http://example.com",
            inst_wav_url=row.instWavURL
            if row.instWavURL
            else "http://example.com",
        )
        for row in results
    ]


def get_user_video(
    user_id: str,
) -> GetVideoIDAndWavURLResponse:
    """
    指定したユーザーIDの動画IDと音声URL（ボーカル・インスト）を取得する。

    Args:
        user_id (str): ユーザーID。

    Returns:
        GetVideoIDAndWavURLResponse: API レスポンスオブジェクト。
    """
    query = _build_query(user_id)
    try:
        results = _execute_query(query, user_id)
        data = _parse_results(results)
        return GetVideoIDAndWavURLResponse(
            status_code=200, status_message="OK", data=data
        )
    except Exception as e:
        return GetVideoIDAndWavURLResponse(
            status_code=500, status_message=str(e), data=[]
        )
