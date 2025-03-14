from google.cloud import bigquery


def is_video_exists(
    project_id: str,
    dataset_id: str,
    table_id: str,
    video_id: str,
) -> bool:
    """
    指定した video_id がテーブル内に存在するかをチェックする関数。
    存在すれば True を返し、存在しなければ False を返す。
    """
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    query = f"""
    SELECT EXISTS (
        SELECT 1 FROM {table_ref} WHERE videoID = @video_id
    ) AS exists_flag
    """

    query_parameters = [
        bigquery.ScalarQueryParameter(
            "video_id", "STRING", video_id
        )
    ]

    query_job = client.query(
        query,
        job_config=bigquery.QueryJobConfig(
            query_parameters=query_parameters
        ),
    )

    result = query_job.result()
    row = next(result, None)

    return row.exists_flag if row else False
