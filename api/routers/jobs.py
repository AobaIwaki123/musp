import uuid
from datetime import datetime, timezone
from typing import Dict

from fastapi import APIRouter, HTTPException, WebSocket
from models.job import Job
from models.job_create_request import JobCreateRequest
from models.job_status import JobStatus
from modules.fetch_source import fetch_source
from modules.separate_source import separate_source
from modules.upload_source import upload_source
from modules.get_download_link import get_download_link

router = APIRouter()

jobs: Dict[str, Job] = {
    "ff45aa91-ce04-43b0-8705-3e3099d6de72": Job(
        job_id="ff45aa91-ce04-43b0-8705-3e3099d6de72",
        status=JobStatus.PENDING,
        youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        s3_url="https://s3.example.com/ff45aa91-ce04-43b0-8705-3e3099d6de72/vocal.mp3",
        created_at="2025-03-03T12:00:00Z",
        updated_at="2025-03-03T12:00:00Z",
    ).model_dump(),
}


# ジョブ作成エンドポイント
@router.post(
    "/jobs",
    response_model=Job,
)
def create_job(request: JobCreateRequest):
    job_id = str(uuid.uuid4())
    print(f"Creating job {job_id}")
    job = Job(
        job_id=job_id,
        status=JobStatus.PENDING,
        youtube_url=str(request.youtube_url),
        s3_url=None,
        created_at="2025-03-03T12:00:00Z",
        updated_at="2025-03-03T12:00:00Z",
    )
    jobs[job_id] = job.model_dump()
    print(f"Created job {job_id}")
    update_job_status(job_id, JobStatus.PROCESSING)
    fetch_source(job)
    print(f"Fetched source for job {job_id}")
    separate_source(job)
    print(f"Separated source for job {job_id}")
    upload_source(job)
    print(f"Uploaded source for job {job_id}")
    url = get_download_link(job)
    job["s3_url"] = url
    update_job_status(job_id, JobStatus.COMPLETED)
    return jobs[job_id]


# ジョブ状態確認エンドポイント
@router.get(
    "/jobs/{job_id}",
    response_model=Job,
)
def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]


# 分離された音源の取得（S3 URLを返す）
@router.get(
    "/jobs/{job_id}/{track}",
)
def get_separated_audio(job_id: str, track: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    if track not in ["vocal", "instrumental"]:
        raise HTTPException(status_code=400, detail="Invalid track type")

    # モックのS3 URLを返す
    jobs[job_id]["s3_url"] = f"https://s3.example.com/{job_id}/{track}.mp3"
    return {"s3_url": jobs[job_id]["s3_url"]}


# WebSocketによるジョブ進捗確認
@router.websocket(
    "/ws/jobs/{job_id}",
)
async def websocket_job_status(websocket: WebSocket, job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    await websocket.accept()
    while jobs[job_id]["status"] in [
        JobStatus.PENDING,
        JobStatus.PROCESSING,
    ]:
        job = jobs[job_id]
        await websocket.send_json({"job_id": job_id, "status": job["status"]})
    await websocket.close()


def update_job_status(job_id: str, new_status: JobStatus):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    current_status = jobs[job_id]["status"]

    # 不正なステータス遷移を防ぐ
    valid_transitions = {
        JobStatus.PENDING: [JobStatus.PROCESSING],
        JobStatus.PROCESSING: [
            JobStatus.COMPLETED,
            JobStatus.FAILED,
        ],
        JobStatus.COMPLETED: [],
        JobStatus.FAILED: [],
    }

    if new_status not in valid_transitions[current_status]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status transition from {current_status} to {new_status}",
        )

    # 安全にジョブの状態を更新
    jobs[job_id]["status"] = new_status
    jobs[job_id]["updated_at"] = datetime.now(timezone.utc)

    return jobs[job_id]
