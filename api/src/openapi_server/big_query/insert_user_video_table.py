from google.cloud import bigquery


def insert_user_video_table(
    project_id,
    dataset_id,
    table_id,
    user_id,
    video_id,
    other_columns,
):
    client = bigquery.Client()
    table_ref = f"`{project_id}.{dataset_id}.{table_id}`"

    # 既存の行の存在チェック
    check_query = f"""
    SELECT COUNT(*) as count
    FROM {table_ref}
    WHERE userID = {user_id} AND videoID = {video_id}
    """

    check_job = client.query(check_query)
    result = check_job.result()
    row = next(result)

    if row.count > 0:
        print("Row already exists, skipping insert.")
        return

    # 存在しない場合のみ挿入
    insert_query = f"""
    INSERT INTO {table_ref} (userID, videoID, {", ".join(other_columns.keys())})
    VALUES ({user_id}, {video_id}, {", ".join(map(str, other_columns.values()))})
    """

    insert_job = client.query(insert_query)
    insert_job.result()  # クエリが完了するのを待つ
    print("Insert completed as no duplicate existed.")


if __name__ == "__main__":
    # 例の呼び出し
    dataset = "your_dataset"
    table = "your_table"
    project = "your_project"
    user_id_value = 1234
    video_id_value = 5678
    other_values = {
        "column1": "'value1'",
        "column2": 42,
    }  # 文字列はクオートが必要

    insert_user_video_table(
        project,
        dataset,
        table,
        user_id_value,
        video_id_value,
        other_values,
    )
