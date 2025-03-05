# celery_app.py
from celery import Celery
from time import sleep
# Celeryのインスタンスを作成し、Redisをブローカーとバックエンドに設定
app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/1",
)


@app.task(bind=True)
def sample_task(self, x, y):
    self.update_state(state="RUNNING")
    print("Task is running...")
    sleep(1)
    result = x + y  # 実際のタスク処理
    print("Task is done!")
    self.update_state(state="SUCCESS")
    return result
