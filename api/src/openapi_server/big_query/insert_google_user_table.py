import datetime
from google.cloud import bigquery
from openapi_server.models.post_user_response import (
    PostUserResponse,
)


def insert_google_user_table(
    project_id: str,
    dataset_id: str,
    table_id: str,
    google_id: str,
    user_id: str,
) -> PostUserResponse:
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    # 既存の行の存在チェック
    check_query = f"""
    SELECT COUNT(*) as count
    FROM {table_ref}
    WHERE userID = @user_id AND googleID = @google_id
    """
    check_job = client.query(
        check_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "user_id", "STRING", user_id
                ),
                bigquery.ScalarQueryParameter(
                    "google_id", "STRING", google_id
                ),
            ]
        ),
    )
    result = check_job.result()
    row = next(result)

    if row.count > 0:
        print("Row already exists, skipping insert.")
        return PostUserResponse(
            status_code=200,
            status_message="User already exists",
            user_id=user_id,
        )

    # `createdAt` と `updatedAt` を取得 (TIMESTAMP 型)
    timestamp = datetime.datetime.utcnow()

    # 挿入データのカラムとパラメータ
    columns = [
        "userID",
        "googleID",
        "createdAt",
        "updatedAt",
    ]
    values_placeholders = [
        "@user_id",
        "@google_id",
        "@created_at",
        "@updated_at",
    ]

    query_parameters = [
        bigquery.ScalarQueryParameter(
            "user_id", "STRING", user_id
        ),
        bigquery.ScalarQueryParameter(
            "google_id", "STRING", google_id
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

    return PostUserResponse(
        status_code=201,
        status_message="User created",
        user_id=user_id,
    )
