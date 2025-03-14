import datetime
import uuid
from google.cloud import bigquery
from openapi_server.models.post_user_response import (
    PostUserResponse,
)


def insert_google_user_table(
    project_id: str,
    dataset_id: str,
    table_id: str,
    google_id: str,
) -> PostUserResponse:
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    # 1. `google_id` を元に `user_id` を検索
    check_query = f"""
    SELECT userID
    FROM {table_ref}
    WHERE googleID = @google_id
    """
    check_job = client.query(
        check_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "google_id", "STRING", google_id
                )
            ]
        ),
    )
    result = check_job.result()
    row = next(result, None)  # 存在しない場合は `None`

    if row:
        existing_user_id = row.userID
        print(
            f"User already exists with user_id: {existing_user_id}"
        )
        return PostUserResponse(
            status_code=200,
            status_message="User already exists",
            user_id=existing_user_id,
        )

    # 2. `user_id` が存在しない場合、新しい `user_id` を発行
    new_user_id = str(
        uuid.uuid4()
    )  # UUID を文字列として発行
    timestamp = datetime.datetime.utcnow()

    # 3. `user_id` をテーブルに `INSERT`
    insert_query = f"""
    INSERT INTO {table_ref} (userID, googleID, createdAt, updatedAt)
    VALUES (@user_id, @google_id, @created_at, @updated_at)
    """
    query_parameters = [
        bigquery.ScalarQueryParameter(
            "user_id", "STRING", new_user_id
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

    insert_job = client.query(
        insert_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=query_parameters
        ),
    )
    insert_job.result()  # クエリが完了するのを待つ
    print(f"New user created with user_id: {new_user_id}")

    return PostUserResponse(
        status_code=201,
        status_message="User created",
        user_id=new_user_id,
    )
