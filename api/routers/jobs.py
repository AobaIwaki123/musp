import uuid
from typing import Dict

from fastapi import APIRouter, HTTPException, Security
from models.job import Job
from models.job_create_request import JobCreateRequest
from models.job_response import JobResponse
from utils.auth import check_key

router = APIRouter()

jobs: Dict[str, Dict] = {}


# ジョブ作成エンドポイント
@router.post(
    "/jobs",
    response_model=JobResponse,
    dependencies=[Security(check_key)],
)
def create_job(request: JobCreateRequest):
    job_id = str(uuid.uuid4())
    job = Job(
        job_id=job_id,
        status="pending",
        youtube_url=str(request.youtube_url),
        s3_url=None,
        created_at="2025-03-03T12:00:00Z",
        updated_at="2025-03-03T12:00:00Z",
    )
    jobs[job_id] = job.dict()
    return jobs[job_id]


# ジョブ状態確認エンドポイント
@router.get(
    "/jobs/{job_id}",
    response_model=JobResponse,
    dependencies=[Security(check_key)],
)
def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]


# 分離された音源の取得（S3 URLを返す）
@router.get(
    "/jobs/{job_id}/{track}", dependencies=[Security(check_key)]
)
def get_separated_audio(job_id: str, track: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    if track not in ["vocal", "instrumental"]:
        raise HTTPException(
            status_code=400, detail="Invalid track type"
        )

    # モックのS3 URLを返す
    jobs[job_id]["s3_url"] = (
        f"https://s3.example.com/{job_id}/{track}.mp3"
    )
    return {"s3_url": jobs[job_id]["s3_url"]}


# WebSocketによるジョブ進捗確認
# @router.websocket(
#     "/ws/jobs/{job_id}", dependencies=[Security(check_key)]
# )
# def websocket_job_status(websocket: WebSocket, job_id: str):
#     if job_id not in jobs:
#         raise HTTPException(status_code=404, detail="Job not found")
#
#     websocket.accept()
#     for status in ["processing", "completed"]:
#         jobs[job_id]["status"] = status
#         websocket.send_json({"job_id": job_id, "status": status})
#     websocket.close()
