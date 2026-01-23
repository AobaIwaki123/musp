import logging
import re
from typing import Union

from openapi_server.apis.post_api_base import BasePOSTApi
from openapi_server.models.error_response400 import ErrorResponse400
from openapi_server.models.post_user_request import PostUserRequest
from openapi_server.models.post_user_response import PostUserResponse
from openapi_server.models.post_video_request import PostVideoRequest
from openapi_server.models.post_video_response import PostVideoResponse
from openapi_server.models.refresh_urls_response import RefreshUrlsResponse

from openapi_server.bigquery import insert_user_video_table, insert_video_status, update_signed_url, is_video_status_exists
from openapi_server.launcher import trigger_worker
from openapi_server.gcs import generate_signed_url

# Need to update bigquery.py to export these or implement logic here.
# For now, I will reuse `bigquery.py` functions and adapt them or copy logic.
# However, user registration logic is missing from `bigquery.py`.
# I should probably update `bigquery.py` to include user registration first or add it here.
# Actually, the user's `bigquery.py` only had `insert_user_video_table` and `insert_video_status`.
# I need to port `insert_google_user_table` from the *original* API if I want to support /users.

from google.cloud import bigquery
from openapi_server.config import settings
import datetime

logger = logging.getLogger(__name__)

class POSTApiImpl(BasePOSTApi):
    async def video_post(
        self,
        post_video_request: PostVideoRequest,
    ) -> Union[PostVideoResponse, ErrorResponse400]:
        try:
            # Extract video ID
            pattern = r"([a-zA-Z0-9_-]{11})"
            match = re.search(pattern, post_video_request.youtube_url)
            if not match:
                 raise ValueError("Could not extract video ID")
            video_id = match.group(1)

            # Link User to Video in BQ
            response = insert_user_video_table(post_video_request.user_id, video_id)

            # 1. Check if video exists
            if is_video_status_exists(video_id):
                logger.info(f"Video {video_id} already exists. Skipping worker trigger.")
                return response

            # 2. Insert/Update status in BQ (only if new)
            logger.info(f"Inserting video status for {video_id}")
            insert_video_status(video_id, status="PENDING")
            
            # 3. Trigger Worker
            trigger_worker()
            
            return response
        except Exception as e:
            logger.error(f"Error in video_post: {e}", exc_info=True)
            return ErrorResponse400(error=str(e))

    async def users_post(
        self,
        post_user_request: PostUserRequest,
    ) -> Union[PostUserResponse, ErrorResponse400]:
        try:
            # Implement user registration logic (simplified port from original)
            client = bigquery.Client()
            table_ref = f"`{settings.PROJECT_ID}.{settings.DATASET_ID}.googleID-userID`"
            google_id = post_user_request.google_id
            
            # 1. Check if user exists
            query = f"SELECT userID FROM {table_ref} WHERE googleID = @google_id"
            job_config = bigquery.QueryJobConfig(
                query_parameters=[bigquery.ScalarQueryParameter("google_id", "STRING", google_id)]
            )
            result = client.query(query, job_config=job_config).result()
            row = next(result, None)

            if row:
                return PostUserResponse(
                    status_code=200,
                    status_message="User already exists",
                    user_id=row.userID
                )
            
            # 2. Create new user
            import uuid
            new_user_id = str(uuid.uuid4())
            timestamp = datetime.datetime.utcnow()
            
            insert_query = f"""
            INSERT INTO {table_ref} (userID, googleID, createdAt, updatedAt)
            VALUES (@user_id, @google_id, @created_at, @updated_at)
            """
            insert_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("user_id", "STRING", new_user_id),
                    bigquery.ScalarQueryParameter("google_id", "STRING", google_id),
                    bigquery.ScalarQueryParameter("created_at", "TIMESTAMP", timestamp),
                    bigquery.ScalarQueryParameter("updated_at", "TIMESTAMP", timestamp),
                ]
            )
            client.query(insert_query, job_config=insert_config).result()
            
            return PostUserResponse(
                status_code=201,
                status_message="User created",
                user_id=new_user_id
            )

        except Exception as e:
            logger.error(f"Error in users_post: {e}", exc_info=True)
            return ErrorResponse400(error=str(e))

    async def refresh_urls_post(
        self,
    ) -> Union[RefreshUrlsResponse, ErrorResponse400]:
        try:
            # Bulk refresh logic
            client = bigquery.Client()
            # Fetch all videos that are COMPLETED (assuming only completed ones need URLs?)
            # Or just all videos in videoID-vocalWavURL / videoID-instWavURL?
            # Or assume we try to generate for all known videos.
            # Let's fetch from videoID-status where status='COMPLETED'
            
            status_table_ref = f"`{settings.PROJECT_ID}.{settings.DATASET_ID}.videoID-status`"
            query = f"SELECT videoID FROM {status_table_ref} WHERE status = 'COMPLETED'"
            # Maybe limit or paging if too many? For now all.
            
            rows = client.query(query).result()
            count = 0
            
            for row in rows:
                video_id = row.videoID
                vocal_url = generate_signed_url(f"{video_id}/vocals.wav")
                inst_url = generate_signed_url(f"{video_id}/no_vocals.wav")
                
                if vocal_url:
                    update_signed_url(video_id, "vocal", vocal_url)
                if inst_url:
                    update_signed_url(video_id, "inst", inst_url)
                
                if vocal_url or inst_url:
                    count += 1
            
            return RefreshUrlsResponse(
                status_code=200,
                status_message=f"Refreshed {count} videos",
                updated_count=count
            )

        except Exception as e:
            logger.error(f"Error in refresh_urls_post: {e}", exc_info=True)
            return ErrorResponse400(error=str(e))
