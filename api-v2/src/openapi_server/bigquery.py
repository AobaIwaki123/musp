import datetime
from google.cloud import bigquery
from google.cloud import bigquery
from .config import settings
from .models.post_video_response import PostVideoResponse

def insert_user_video_table(user_id: str, video_id: str) -> PostVideoResponse:
    client = bigquery.Client()
    table_ref = f"`{settings.PROJECT_ID}.{settings.DATASET_ID}.userID-videoID`"

    # Check existence
    check_query = f"""
    SELECT COUNT(*) as count
    FROM {table_ref}
    WHERE userID = @user_id AND videoID = @video_id
    """
    check_job = client.query(
        check_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
                bigquery.ScalarQueryParameter("video_id", "STRING", video_id),
            ]
        ),
    )
    result = check_job.result()
    row = next(result)

    if row.count > 0:
        return PostVideoResponse(
            status_code=200,
            status_message="Video already exists",
            youtube_id=video_id,
        )

    # Insert
    timestamp = datetime.datetime.utcnow()
    insert_query = f"""
    INSERT INTO {table_ref} (userID, videoID, createdAt, updatedAt)
    VALUES (@user_id, @video_id, @created_at, @updated_at)
    """
    insert_job = client.query(
        insert_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
                bigquery.ScalarQueryParameter("video_id", "STRING", video_id),
                bigquery.ScalarQueryParameter("created_at", "TIMESTAMP", timestamp),
                bigquery.ScalarQueryParameter("updated_at", "TIMESTAMP", timestamp),
            ]
        ),
    )
    insert_job.result()

    return PostVideoResponse(
        status_code=201,
        status_message="Job created",
        youtube_id=video_id,
    )

def insert_video_status(video_id: str, status: str = "pending"):
    client = bigquery.Client()
    table_ref = f"`{settings.PROJECT_ID}.{settings.DATASET_ID}.videoID-status`"
    timestamp = datetime.datetime.utcnow()

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
    upsert_job = client.query(
        upsert_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("video_id", "STRING", video_id),
                bigquery.ScalarQueryParameter("status", "STRING", status),
                bigquery.ScalarQueryParameter("created_at", "TIMESTAMP", timestamp),
                bigquery.ScalarQueryParameter("updated_at", "TIMESTAMP", timestamp),
            ]
        ),
    )
    upsert_job.result()

def update_signed_url(video_id: str, url_type: str, url: str):
    """
    Updates the signed URL in BQ.
    url_type: 'vocal' or 'inst'
    """
    client = bigquery.Client()
    
    if url_type == "vocal":
        table_name = "videoID-vocalWavURL"
    elif url_type == "inst":
        table_name = "videoID-instWavURL"
    else:
        raise ValueError("Invalid url_type")

    table_ref = f"`{settings.PROJECT_ID}.{settings.DATASET_ID}.{table_name}`"
    timestamp = datetime.datetime.utcnow()

    upsert_query = f"""
    MERGE {table_ref} AS target
    USING (SELECT @video_id AS videoID, @wav_url AS wavURL, @created_at AS createdAt, @updated_at AS updatedAt) AS source
    ON target.videoID = source.videoID
    WHEN MATCHED THEN
        UPDATE SET wavURL = source.wavURL, updatedAt = source.updatedAt
    WHEN NOT MATCHED THEN
        INSERT (videoID, wavURL, createdAt, updatedAt)
        VALUES (source.videoID, source.wavURL, source.createdAt, source.updatedAt)
    """

    upsert_job = client.query(
        upsert_query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("video_id", "STRING", video_id),
                bigquery.ScalarQueryParameter("wav_url", "STRING", url),
                bigquery.ScalarQueryParameter("created_at", "TIMESTAMP", timestamp),
                bigquery.ScalarQueryParameter("updated_at", "TIMESTAMP", timestamp),
            ]
        ),
    )
    upsert_job.result()

def is_video_status_exists(video_id: str) -> bool:
    """
    Checks if a video ID exists in the videoID-status table.
    """
    client = bigquery.Client()
    table_ref = f"`{settings.PROJECT_ID}.{settings.DATASET_ID}.videoID-status`"

    query = f"SELECT COUNT(*) as count FROM {table_ref} WHERE videoID = @video_id"
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("video_id", "STRING", video_id)
        ]
    )
    result = client.query(query, job_config=job_config).result()
    row = next(result)
    exists = row.count > 0
    return exists
