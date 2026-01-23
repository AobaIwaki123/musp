#!/usr/bin/env python3
"""
MuSP Worker - Spot VM audio processing worker.

This worker runs on a GCP Spot VM and processes YouTube audio:
1. Downloads audio from YouTube
2. Separates vocals and instruments using Demucs
3. Uploads results to GCS
4. Updates BigQuery with signed URLs
5. Deletes itself when complete
"""

import concurrent.futures
import logging
import os
import sys
import tempfile
from typing import Optional

from utils.bigquery import BigQueryClient, TaskStatus
from utils.gcs import GCSClient
from utils.metadata import get_instance_name
from utils.youtube import construct_youtube_url
from tasks.fetch_source import fetch_source
from tasks.separate_source import separate_source
from tasks.upload_source import upload_source
from tasks.update_status import update_status
from tasks.cleanup import cleanup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)

logger = logging.getLogger(__name__)


def process_video(video_id: str) -> bool:
    """
    Process a single video.

    Args:
        video_id: The YouTube video ID.

    Returns:
        True if successful, False otherwise.
    """
    logger.info(f"Starting processing for video: {video_id}")
    
    try:
        # Initialize clients per process
        bq_client = BigQueryClient()
        gcs_client = GCSClient()

        # Get instance name for tracking
        instance_name = get_instance_name() or "unknown-worker"
        
        youtube_url = construct_youtube_url(video_id)
        logger.info(f"YouTube URL: {youtube_url}")

        # Create temporary working directory
        work_dir = tempfile.mkdtemp(prefix=f"musp_worker_{video_id}_")
        logger.info(f"Working directory: {work_dir}")

        try:
            # Step 1: Update status to PROCESSING
            logger.info(f"[{video_id}] Step 1: Updating status to PROCESSING")
            update_status(
                video_id=video_id,
                status=TaskStatus.PROCESSING,
                bq_client=bq_client,
                vm_instance_name=instance_name,
            )

            # Step 2: Fetch source from YouTube
            logger.info(f"[{video_id}] Step 2: Fetching source from YouTube")
            source_path = fetch_source(
                video_id=video_id,
                youtube_url=youtube_url,
                work_dir=work_dir,
            )

            # Step 3: Separate vocals and instruments
            logger.info(f"[{video_id}] Step 3: Separating audio")
            vocal_path, inst_path = separate_source(
                video_id=video_id,
                source_path=source_path,
                work_dir=work_dir,
            )

            # Step 4: Upload to GCS
            logger.info(f"[{video_id}] Step 4: Uploading to GCS")
            upload_source(
                video_id=video_id,
                vocal_path=vocal_path,
                inst_path=inst_path,
                gcs_client=gcs_client,
            )

            # Step 5: Update status to COMPLETED
            logger.info(f"[{video_id}] Step 5: Updating status to COMPLETED")
            update_status(
                video_id=video_id,
                status=TaskStatus.COMPLETED,
                bq_client=bq_client,
            )

            logger.info(f"Successfully processed video: {video_id}")
            return True

        except Exception as e:
            logger.error(f"Error processing video {video_id}: {e}", exc_info=True)

            # Update status to FAILED
            try:
                update_status(
                    video_id=video_id,
                    status=TaskStatus.FAILED,
                    bq_client=bq_client,
                    error_message=str(e)[:1000],
                )
            except Exception as status_error:
                logger.error(f"Failed to update status to FAILED for {video_id}: {status_error}")

            return False
        
        finally:
            # Cleanup local files (do not delete VM)
            logger.info(f"[{video_id}] Cleanup local files")
            cleanup(video_id=video_id, work_dir=work_dir, delete_vm=False)

    except Exception as e:
        logger.error(f"Critical error in process_video for {video_id}: {e}", exc_info=True)
        return False


def main() -> int:
    """
    Main entry point for the worker.

    Returns:
        Exit code (0 for success, 1 for failure).
    """
    logger.info("MuSP Worker starting...")

    # Initialize BigQuery client for fetching tasks
    try:
        bq_client = BigQueryClient()
    except Exception as e:
        logger.error(f"Failed to initialize BigQuery client: {e}")
        return 1

    # Fetch all incomplete videos
    try:
        video_ids = bq_client.fetch_incomplete_videos()
    except Exception as e:
        logger.error(f"Failed to fetch incomplete videos: {e}")
        return 1

    if not video_ids:
        logger.info("No incomplete videos found.")
        # Even if no videos, we should cleanup/delete VM to save costs
        cleanup(video_id="none", work_dir="/tmp", delete_vm=True)
        return 0

    logger.info(f"Found {len(video_ids)} videos to process: {video_ids}")

    # Process videos in parallel
    # Default to 2 workers to balance GPU load
    max_workers = int(os.getenv("MAX_WORKERS", "2"))
    failed_count = 0

    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        future_to_video = {executor.submit(process_video, vid): vid for vid in video_ids}
        
        for future in concurrent.futures.as_completed(future_to_video):
            video_id = future_to_video[future]
            try:
                success = future.result()
                if not success:
                    failed_count += 1
            except Exception as e:
                logger.error(f"Video {video_id} generated an exception: {e}")
                failed_count += 1

    logger.info(f"Batch processing complete. Failed: {failed_count}/{len(video_ids)}")

    # Final cleanup - delete the VM
    logger.info("Final Cleanup: Deleting VM")
    cleanup(video_id="batch_complete", work_dir="/tmp", delete_vm=True)
    
    return 0 if failed_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
