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

import logging
import os
import sys
import tempfile
from typing import Optional

from utils.bigquery import BigQueryClient, TaskStatus
from utils.gcs import GCSClient
from utils.metadata import get_instance_metadata, get_instance_name
from utils.youtube import get_youtube_video_id, normalize_youtube_url
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


def get_video_id_and_url() -> tuple[Optional[str], Optional[str]]:
    """
    Get video_id and youtube_url from GCE metadata or environment variables.

    Returns:
        Tuple of (video_id, youtube_url).
    """
    # Try to get from metadata (GCE) or environment variables
    video_id = get_instance_metadata("video_id") or os.getenv("VIDEO_ID")
    youtube_url = get_instance_metadata("youtube_url") or os.getenv("YOUTUBE_URL")

    # If only URL is provided, extract video_id
    if youtube_url and not video_id:
        video_id = get_youtube_video_id(youtube_url)

    # Normalize the URL
    if youtube_url:
        youtube_url = normalize_youtube_url(youtube_url)

    return video_id, youtube_url


def main() -> int:
    """
    Main entry point for the worker.

    Returns:
        Exit code (0 for success, 1 for failure).
    """
    logger.info("MuSP Worker starting...")

    # Get video information
    video_id, youtube_url = get_video_id_and_url()

    if not video_id or not youtube_url:
        logger.error("Missing video_id or youtube_url")
        return 1

    logger.info(f"Processing video: {video_id}")
    logger.info(f"YouTube URL: {youtube_url}")

    # Initialize clients
    try:
        bq_client = BigQueryClient()
        gcs_client = GCSClient()
    except Exception as e:
        logger.error(f"Failed to initialize clients: {e}")
        return 1

    # Get instance name for tracking
    instance_name = get_instance_name()

    # Create temporary working directory
    work_dir = tempfile.mkdtemp(prefix="musp_worker_")
    logger.info(f"Working directory: {work_dir}")

    try:
        # Step 1: Update status to PROCESSING
        logger.info("Step 1: Updating status to PROCESSING")
        update_status(
            video_id=video_id,
            status=TaskStatus.PROCESSING,
            bq_client=bq_client,
            vm_instance_name=instance_name,
        )

        # Step 2: Fetch source from YouTube
        logger.info("Step 2: Fetching source from YouTube")
        source_path = fetch_source(
            video_id=video_id,
            youtube_url=youtube_url,
            work_dir=work_dir,
        )

        # Step 3: Separate vocals and instruments
        logger.info("Step 3: Separating audio")
        vocal_path, inst_path = separate_source(
            video_id=video_id,
            source_path=source_path,
            work_dir=work_dir,
        )

        # Step 4: Upload to GCS
        logger.info("Step 4: Uploading to GCS")
        upload_source(
            video_id=video_id,
            vocal_path=vocal_path,
            inst_path=inst_path,
            gcs_client=gcs_client,
        )

        # Step 5: Update status to COMPLETED
        logger.info("Step 5: Updating status to COMPLETED")
        update_status(
            video_id=video_id,
            status=TaskStatus.COMPLETED,
            bq_client=bq_client,
        )

        logger.info(f"Successfully processed video: {video_id}")

    except Exception as e:
        logger.error(f"Error processing video {video_id}: {e}", exc_info=True)

        # Update status to FAILED
        try:
            update_status(
                video_id=video_id,
                status=TaskStatus.FAILED,
                bq_client=bq_client,
                error_message=str(e)[:1000],  # Truncate long error messages
            )
        except Exception as status_error:
            logger.error(f"Failed to update status to FAILED: {status_error}")

        # Cleanup and exit
        cleanup(video_id=video_id, work_dir=work_dir, delete_vm=True)
        return 1

    # Step 6: Cleanup
    logger.info("Step 6: Cleanup")
    cleanup(video_id=video_id, work_dir=work_dir, delete_vm=True)

    return 0


if __name__ == "__main__":
    sys.exit(main())
