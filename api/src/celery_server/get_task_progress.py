from celery_server.redis_client import redis_client


def get_task_progress(root_task_id):
    """
    メインタスクの進捗を取得する関数
    """
    subtask_ids = redis_client.get(f"task:{root_task_id}:subtasks")
    if not subtask_ids:
        return {"error": "タスクが見つかりません"}

    subtask_ids = subtask_ids.split(",")
    progress = {}
    for subtask_id in subtask_ids:
        status = (
            redis_client.get(f"task:{root_task_id}:{subtask_id}")
            or "PENDING"
        )
        progress[subtask_id] = status

    return {"root_task_id": root_task_id, "progress": progress}
