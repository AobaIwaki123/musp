import asyncio
from typing import Dict

from celery.result import AsyncResult
from celery_app.celery_app import app
from celery_app.job_task import job_task
from fastapi import (
    APIRouter,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
)
from models.job import Job, get_youtube_thumbnail_url
from models.job_create_request import JobCreateRequest
from models.job_status import JobStatus

router = APIRouter()

jobs: Dict[str, Job] = {
    "ff45aa91-ce04-43b0-8705-3e3099d6de72": Job(
        job_id="ff45aa91-ce04-43b0-8705-3e3099d6de72",
        status=JobStatus.PENDING,
        youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        download_link="https://s3.example.com/ff45aa91-ce04-43b0-8705-3e3099d6de72/vocal.mp3",
        created_at="2025-03-03T12:00:00Z",
        updated_at="2025-03-03T12:00:00Z",
    ).model_dump(),
}


# ジョブ作成エンドポイント
@router.post(
    "/jobs",
    response_model=None,
)
def create_job(request: JobCreateRequest):
    try:
        # タスクを非同期で起動
        result = job_task.delay(str(request.youtube_url))
        return {"message": "Task launched", "job_id": result.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ジョブ状態確認エンドポイント
@router.get(
    "/jobs/{job_id}",
    response_model=None,
)
def get_job_status(job_id: str):
    try:
        result = AsyncResult(job_id, app=app)
        return {"status": result.state}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 分離された音源の取得（S3 URLを返す）
@router.get(
    "/url/{job_id}",
)
def get_separated_audio(job_id: str):
    try:
        result = AsyncResult(job_id, app=app)
        if result.state != "SUCCESS":
            raise HTTPException(
                status_code=404, detail="Job not completed yet"
            )
        job_dict = result.info
        return {
            "job_id": job_id,
            "url": job_dict["download_link"], 
            "thumbnail": get_youtube_thumbnail_url(job_dict["youtube_url"])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# WebSocketによるジョブ進捗確認
@router.websocket(
    "/ws/jobs/{job_id}",
)
async def websocket_job_status(websocket: WebSocket, job_id: str):
    print(f"WebSocket connected for task_id: {job_id}")
    await websocket.accept()

    try:
        while True:
            # タスクの状態をポーリング
            result = AsyncResult(job_id)
            status = result.state
            info = result.info
            print("Task Info:", info)

            # WebSocketで状態をJSON形式で送信
            await websocket.send_json({"status": status})

            # タスクが完了（SUCCESSまたはFAILURE）したらループを抜ける
            if status in ("SUCCESS", "FAILURE"):
                break

            # 1秒待機してから再度チェック
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for task_id: {job_id}")

    await websocket.close()
