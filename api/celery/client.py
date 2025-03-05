# client.py
from celery.result import AsyncResult  # noqa: F401
from celery_app import sample_task
from time import sleep
print("Celery client")

# タスクの送信
result = sample_task.delay(10, 20)

# タスクIDの取得
task_id = result.id
print("Task ID:", task_id)

print("Wait 3 seconds...")

searched_result = AsyncResult(task_id)
print("Current state:", searched_result.state)
sleep(3)
# タスクIDでタスクの状態を検索
print("Current state:", searched_result.state)

# タスクが途中で保存したメタ情報や最終結果の取得
# タスクがまだ進行中の場合は、metaに格納した情報が取得できる
print("Task info:", searched_result.info)
