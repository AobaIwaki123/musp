# celery_app.py
from time import sleep

from celery import Celery

# Celeryのインスタンスを作成し、Redisをブローカーとバックエンドに設定
app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/1",
)

app.conf.update(
    result_expires=3600,
    task_ignore_result=False,
)


@app.task(bind=True)
def sample_task(self, x: int, y: int) -> dict[str, int]:
    self.update_state(state="RUNNING")
    print("Task is running...")
    sleep(1)
    result = x + y  # 実際のタスク処理
    return {"result": result}
