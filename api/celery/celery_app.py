# celery_app.py

from celery import Celery

# Celeryのインスタンスを作成し、Redisをブローカーとバックエンドに設定
app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/1",
    include=["job_task"],
)

app.conf.update(
    result_expires=3600,
    task_ignore_result=False,
)

app.autodiscover_tasks(["celery"])
