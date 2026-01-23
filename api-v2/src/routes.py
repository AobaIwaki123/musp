from fastapi import APIRouter, HTTPException
from .models import PostVideoRequest, PostVideoResponse
from .bigquery import insert_user_video_table, insert_video_status
from .launcher import trigger_worker

router = APIRouter()

@router.post("/tasks", response_model=PostVideoResponse, status_code=201)
async def create_task(request: PostVideoRequest):
    try:
        # Extract video ID (already validated by regex in model)
        # We need to extract it again or rely on the validated value.
        # The regex in model ensures format, but let's extract carefully.
        import re
        pattern = r"([a-zA-Z0-9_-]{11})"
        match = re.search(pattern, request.youtube_url)
        if not match:
             raise ValueError("Could not extract video ID")
        video_id = match.group(1)

        # 1. Insert/Update status in BQ
        insert_video_status(video_id, status="pending")
        
        # 2. Link User to Video in BQ
        response = insert_user_video_table(request.user_id, video_id)
        
        # 3. Trigger Worker
        trigger_worker()
        
        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/videos/{video_id}/refresh-urls", status_code=200)
async def refresh_signed_urls(video_id: str):
    try:
        from .gcs import generate_signed_url
        from .bigquery import update_signed_url
        
        # 1. Generate Signed URLs
        vocal_url = generate_signed_url(f"{video_id}/vocals.wav")
        inst_url = generate_signed_url(f"{video_id}/no_vocals.wav")

        if not vocal_url and not inst_url:
            raise HTTPException(status_code=404, detail="Files not found")

        # 2. Update BQ
        if vocal_url:
            update_signed_url(video_id, "vocal", vocal_url)
        if inst_url:
            update_signed_url(video_id, "inst", inst_url)

        return {
            "status": "updated",
            "video_id": video_id,
            "vocal_url": vocal_url,
            "inst_url": inst_url
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
