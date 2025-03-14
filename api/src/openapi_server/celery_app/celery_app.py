# celery_app.py

import os

from celery import Celery

# Celeryのインスタンスを作成し、Redisをブローカーとバックエンドに設定

CELERY_BROKER = os.getenv("CELERY_BROKER", "redis://redis:6379/0")
CELERY_BACKEND = os.getenv("CELERY_BACKEND", "redis://redis:6379/1")

app = Celery(
    "tasks",
    broker=CELERY_BROKER,
    backend=CELERY_BACKEND,
    include=[
        "openapi_server.tasks.process_source",
    ],
)

app.conf.update(
    result_expires=3600,
    task_ignore_result=False,
    celery_task_always_eager=False,
)
