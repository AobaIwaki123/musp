from typing import Optional

from fastapi import APIRouter, Path
from models.generated_model import (
    Job,
    JobsPostRequest,
    JobsPostResponse,
    Status,
    Track,
)

router = APIRouter()


@router.post(
    "/jobs", response_model=None, responses={"201": {"model": JobsPostResponse}}
)
def post_jobs(body: JobsPostRequest) -> Optional[JobsPostResponse]:
    """
    新規ジョブの作成
    """
    return JobsPostResponse(job_id="job_id", message="message")


@router.get("/jobs/{jobId}", response_model=Job)
def get_jobs_job_id(job_id: str = Path(..., alias="jobId")) -> Job:
    """
    ジョブの状態確認
    """
    return Status.pending


@router.get("/jobs/{jobId}/{track}", response_model=bytes)
def get_jobs_job_id_track(
    job_id: str = Path(..., alias="jobId"), track: Track = ...
) -> bytes:
    """
    分離された音源の取得
    """
    return b""
