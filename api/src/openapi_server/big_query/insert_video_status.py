import datetime

from google.cloud import bigquery


def insert_video_status(
    project_id: str,
    dataset_id: str,
    table_id: str,
    video_id: str,
    status: str,
):
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    timestamp = datetime.datetime.utcnow()

    # 常に新しいレコードを挿入
    insert_query = f"""
    INSERT INTO {table_ref} (videoID, status, createdAt, updatedAt)
    VALUES (@video_id, @status, @created_at, @updated_at)
    """
    query_parameters = [
        bigquery.ScalarQueryParameter(
            "video_id", "STRING", video_id
        ),
        bigquery.ScalarQueryParameter(
            "status", "STRING", status
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
    insert_job.result()
    print(
        f"New video entry created with video_id: {video_id}"
    )
