import datetime

from google.cloud import bigquery
from openapi_server.models.post_video_response import (
    PostVideoResponse,
)


def insert_user_video_table(
    project_id: str,
    dataset_id: str,
    table_id: str,
    user_id: str,
    video_id: str,
) -> PostVideoResponse:
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    # 既存の行の存在チェック
    check_query = f"""
    SELECT COUNT(*) as count
    FROM {table_ref}
    WHERE userID = @user_id AND videoID = @video_id
    """
    check_job = client.query(
        check_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "user_id", "STRING", user_id
                ),
                bigquery.ScalarQueryParameter(
                    "video_id", "STRING", video_id
                ),
            ]
        ),
    )
    result = check_job.result()
    row = next(result)

    if row.count > 0:
        print("Row already exists, skipping insert.")
        return PostVideoResponse(
            status_code=200,
            status_message="Video already exists",
            youtube_id=video_id,
        )

    # `createdAt` と `updatedAt` を取得 (TIMESTAMP 型)
    timestamp = datetime.datetime.utcnow()

    # 挿入データのカラムとパラメータ
    columns = [
        "userID",
        "videoID",
        "createdAt",
        "updatedAt",
    ]
    values_placeholders = [
        "@user_id",
        "@video_id",
        "@created_at",
        "@updated_at",
    ]

    query_parameters = [
        bigquery.ScalarQueryParameter(
            "user_id", "STRING", user_id
        ),
        bigquery.ScalarQueryParameter(
            "video_id", "STRING", video_id
        ),
        bigquery.ScalarQueryParameter(
            "created_at", "TIMESTAMP", timestamp
        ),
        bigquery.ScalarQueryParameter(
            "updated_at", "TIMESTAMP", timestamp
        ),
    ]

    # 挿入クエリの実行
    insert_query = f"""
    INSERT INTO {table_ref} ({", ".join(columns)})
    VALUES ({", ".join(values_placeholders)})
    """
    insert_job = client.query(
        insert_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=query_parameters
        ),
    )
    insert_job.result()  # クエリが完了するのを待つ
    print("Insert completed as no duplicate existed.")

    return PostVideoResponse(
        status_code=201,
        status_message="Job created",
        youtube_id=video_id,
    )
