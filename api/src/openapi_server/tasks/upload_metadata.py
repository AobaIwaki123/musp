import json

import requests
from celery_server.celery_app import app
from google.cloud import bigquery, storage
from openapi_server.models.post_jobs_request import PostJobsRequest


def get_youtube_metadata(youtube_link):
    """Fetch YouTube title and thumbnail from a given link"""
    video_id = youtube_link.split("v=")[-1]
    api_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()
        return data.get("title"), data.get("thumbnail_url")
    else:
        return None, None


def upload_json_to_gcs(bucket_name, destination_blob_name, data):
    """Uploads a JSON file to Cloud Storage"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_string(
        json.dumps(data), content_type="application/json"
    )
    return f"gs://{bucket_name}/{destination_blob_name}"


def insert_into_bigquery(dataset_id, table_id, row):
    """Insert a row into BigQuery if it doesn't exist"""
    client = bigquery.Client()
    table_ref = client.dataset(dataset_id).table(table_id)

    query = f"""
    INSERT INTO `{dataset_id}.{table_id}` (user_id, root_task_id)
    SELECT @user_id, @root_task_id
    FROM UNNEST([1])
    WHERE NOT EXISTS (
        SELECT 1 FROM `{dataset_id}.{table_id}`
        WHERE user_id = @user_id AND root_task_id = @root_task_id
    )"""

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter(
                "user_id", "STRING", row["user_id"]
            ),
            bigquery.ScalarQueryParameter(
                "root_task_id", "STRING", row["root_task_id"]
            ),
        ]
    )

    client.query(query, job_config=job_config).result()


def insert_task_title(dataset_id, table_id, row):
    """Insert a root_task_id and youtube_title into BigQuery if not exists"""
    client = bigquery.Client()
    table_ref = client.dataset(dataset_id).table(table_id)

    query = f"""
    INSERT INTO `{dataset_id}.{table_id}` (root_task_id, youtube_title)
    SELECT @root_task_id, @youtube_title
    FROM UNNEST([1])
    WHERE NOT EXISTS (
        SELECT 1 FROM `{dataset_id}.{table_id}`
        WHERE root_task_id = @root_task_id
    )"""

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter(
                "root_task_id", "STRING", row["root_task_id"]
            ),
            bigquery.ScalarQueryParameter(
                "youtube_title", "STRING", row["youtube_title"]
            ),
        ]
    )

    client.query(query, job_config=job_config).result()


@app.task(bind=True)
def process_youtube_metadata(
    self, data: dict, root_task_id: str
) -> dict:
    """YouTubeメタデータを処理し、GCSとBigQueryに登録"""
    user_id = data["user_id"]
    youtube_link = data["youtube_url"]

    youtube_title, youtube_thumbnail = get_youtube_metadata(
        youtube_link
    )
    if not youtube_title or not youtube_thumbnail:
        return {"error": "Failed to fetch YouTube metadata"}

    bucket_name = "musp"
    json_data = {
        "title": youtube_title,
        "thumbnail": youtube_thumbnail,
    }
    destination_blob_name = f"{root_task_id}/metadata.json"

    gcs_url = upload_json_to_gcs(
        bucket_name, destination_blob_name, json_data
    )

    dataset_id = "musp"
    user_tasks_table = "user_tasks"
    task_titles_table = "task_titles"

    insert_into_bigquery(
        dataset_id,
        user_tasks_table,
        {"user_id": user_id, "root_task_id": root_task_id},
    )
    insert_task_title(
        dataset_id,
        task_titles_table,
        {
            "root_task_id": root_task_id,
            "youtube_title": youtube_title,
        },
    )

    return {"root_task_id": root_task_id, "gcs_url": gcs_url}
