from google.cloud import bigquery
from openapi_server.models.get_video_id_and_wav_url_response import (
    GetVideoIDAndWavURLResponse,
)
from openapi_server.models.video_id_and_wav_url import (
    VideoIDAndWavURL,
)

BQ_PROJECT = "zennaihackason"  # BigQuery プロジェクト ID
BQ_DATASET = "musp_v3"  # BigQuery データセット名
BQ_USER_VIDEO_TABLE = "userID-videoID"
BQ_VIDEO_WAVURL_TABLE = "videoID-vocalWavURL"


def get_user_video(
    user_id: str,
) -> GetVideoIDAndWavURLResponse:
    client = bigquery.Client()

    query = f"""
        SELECT uv.videoID, vw.wavURL
        FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_USER_VIDEO_TABLE}` AS uv
        LEFT JOIN `{BQ_PROJECT}.{BQ_DATASET}.{BQ_VIDEO_WAVURL_TABLE}` AS vw
        ON uv.videoID = vw.videoID
        WHERE uv.userID = @user_id
    """

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter(
                "user_id", "STRING", user_id
            )
        ]
    )

    query_job = client.query(query, job_config=job_config)
    results = query_job.result()

    data = [
        VideoIDAndWavURL(
            youtube_id=row.videoID,
            vocal_wav_url=row.wavURL
            if row.wavURL is not None
            else "http://example.com",  # None を明示的に設定
            inst_wav_url="http://example.com",
        )
        for row in results
    ]

    return GetVideoIDAndWavURLResponse(
        status_code=200, status_message="OK", data=data
    )
