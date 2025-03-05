# # celery_app.py
# from datetime import datetime
# from time import sleep
# 
# from celery import Celery
# from models.job import Job
# from models.job_status import JobStatus
# from pydantic import HttpUrl
# 
# # Celeryのインスタンスを作成し、Redisをブローカーとバックエンドに設定
# app = Celery(
#     "tasks",
#     broker="redis://redis:6379/0",
#     backend="redis://redis:6379/1",
# )
# 
# 
# @app.task(bind=True)
# def sample_task(self, x, y):
#     self.update_state(state="RUNNING")
#     print("Task is running...")
#     sleep(1)
#     result = x + y  # 実際のタスク処理
#     print("Task is done!")
#     self.update_state(state="SUCCESS")
#     return result
# 
# 
# @app.task(bind=True)
# def job_task(self, youtube_url: HttpUrl) -> Job:
#     download_link = None
#     return Job(
#         job_id=self.id,
#         status=JobStatus.PENDING,
#         youtube_url=youtube_url,
#         download_link=download_link,
#         created_at=datetime.now(),
#         updated_at=datetime.now(),
#     ).model_dump()
