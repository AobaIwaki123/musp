"""Task: Update video processing status in BigQuery."""

import logging
from typing import Optional

from utils.bigquery import BigQueryClient, TaskStatus

logger = logging.getLogger(__name__)


def update_status(
    video_id: str,
    status: TaskStatus,
    bq_client: BigQueryClient,
    vm_instance_name: Optional[str] = None,
    error_message: Optional[str] = None,
) -> None:
    """
    Update the video processing status in BigQuery.

    Args:
        video_id: The YouTube video ID.
        status: The new status.
        bq_client: BigQuery client instance.
        vm_instance_name: The VM instance name (optional).
        error_message: Error message if status is FAILED (optional).
    """
    logger.info(f"Updating status for {video_id} to {status.value}")

    bq_client.update_status(
        video_id=video_id,
        status=status,
        vm_instance_name=vm_instance_name,
        error_message=error_message,
    )
