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

    # video_id が存在する場合は更新、存在しない場合は挿入
    upsert_query = f"""
    MERGE {table_ref} AS target
    USING (SELECT @video_id AS videoID, @status AS status, @created_at AS createdAt, @updated_at AS updatedAt) AS source
    ON target.videoID = source.videoID
    WHEN MATCHED THEN
        UPDATE SET status = source.status, updatedAt = source.updatedAt
    WHEN NOT MATCHED THEN
        INSERT (videoID, status, createdAt, updatedAt)
        VALUES (source.videoID, source.status, source.createdAt, source.updatedAt)
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
    upsert_job = client.query(
        upsert_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=query_parameters
        ),
    )
    upsert_job.result()
    print(
        f"Video entry updated/inserted with video_id: {video_id}"
    )
