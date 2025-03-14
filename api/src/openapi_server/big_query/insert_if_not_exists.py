from google.cloud import bigquery


def insert_if_not_exists(
    project_id,
    dataset_id,
    table_id,
    user_id,
    video_id,
    other_columns,
):
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    query = f"""
    MERGE INTO {table_ref} AS target
    USING (SELECT {user_id} AS userID, {video_id} AS videoID) AS source
    ON target.userID = source.userID AND target.videoID = source.videoID
    WHEN NOT MATCHED THEN
      INSERT (userID, videoID, {", ".join(other_columns.keys())})
      VALUES ({user_id}, {video_id}, {", ".join(map(str, other_columns.values()))})
    """

    query_job = client.query(query)
    query_job.result()  # クエリが完了するのを待つ
    print("Insert completed if no duplicate exists.")


if __name__ == "__main__":
    # 呼び出しの例
    dataset = "your_dataset"
    table = "your_table"
    project = "your_project"
    user_id_value = 1234
    video_id_value = 5678
    other_values = {
        "column1": "'value1'",
        "column2": 42,
    }  # 文字列はクオートが必要

    insert_if_not_exists(
        project,
        dataset,
        table,
        user_id_value,
        video_id_value,
        other_values,
    )
