"""BigQuery utilities for the worker."""

import logging
import os
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from google.cloud import bigquery

logger = logging.getLogger(__name__)


class TaskStatus(str, Enum):
    """Task status values."""

    PENDING = "pending"
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class BigQueryClient:
    """BigQuery client for worker operations."""

    def __init__(
        self,
        project_id: Optional[str] = None,
        dataset_id: Optional[str] = None,
    ):
        """
        Initialize the BigQuery client.

        Args:
            project_id: GCP project ID. Defaults to GOOGLE_CLOUD_PROJECT env var.
            dataset_id: BigQuery dataset ID. Defaults to DATASET_ID env var.
        """
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT")
        self.dataset_id = dataset_id or os.getenv("DATASET_ID")
        self.client = bigquery.Client(project=self.project_id)

        if not self.project_id or not self.dataset_id:
            raise ValueError("project_id and dataset_id are required")

    def _get_table_ref(self, table_name: str) -> str:
        """Get fully qualified table reference."""
        return f"`{self.project_id}.{self.dataset_id}.{table_name}`"

    def update_status(
        self,
        video_id: str,
        status: TaskStatus,
        vm_instance_name: Optional[str] = None,
        error_message: Optional[str] = None,
    ) -> None:
        """
        Update the video processing status in BigQuery.

        Args:
            video_id: The YouTube video ID.
            status: The new status.
            vm_instance_name: The VM instance name (optional).
            error_message: Error message if status is FAILED (optional).
        """
        table_ref = self._get_table_ref("videoID-status")
        now = datetime.now(timezone.utc)

        # Build update fields based on status
        update_fields = ["status = @status", "updatedAt = @updated_at"]
        params = [
            bigquery.ScalarQueryParameter("video_id", "STRING", video_id),
            bigquery.ScalarQueryParameter("status", "STRING", status.value),
            bigquery.ScalarQueryParameter("updated_at", "TIMESTAMP", now),
        ]

        if vm_instance_name:
            update_fields.append("vmInstanceName = @vm_instance_name")
            params.append(
                bigquery.ScalarQueryParameter(
                    "vm_instance_name", "STRING", vm_instance_name
                )
            )

        if status == TaskStatus.PROCESSING:
            update_fields.append("startedAt = @started_at")
            params.append(
                bigquery.ScalarQueryParameter("started_at", "TIMESTAMP", now)
            )
        elif status in (TaskStatus.COMPLETED, TaskStatus.FAILED):
            update_fields.append("completedAt = @completed_at")
            params.append(
                bigquery.ScalarQueryParameter("completed_at", "TIMESTAMP", now)
            )

        if error_message:
            update_fields.append("errorMessage = @error_message")
            params.append(
                bigquery.ScalarQueryParameter("error_message", "STRING", error_message)
            )

        query = f"""
        UPDATE {table_ref}
        SET {', '.join(update_fields)}
        WHERE videoID = @video_id
        """

        job_config = bigquery.QueryJobConfig(query_parameters=params)
        job = self.client.query(query, job_config=job_config)
        job.result()

        logger.info(f"Updated status for {video_id} to {status.value}")

    def fetch_incomplete_videos(self) -> list[str]:
        """
        Fetch all unique video IDs that are not COMPLETED.

        Returns:
            List of video IDs.
        """
        table_ref = self._get_table_ref("videoID-status")
        query = f"""
        SELECT DISTINCT videoID
        FROM {table_ref}
        WHERE status != 'COMPLETED'
        """

        job = self.client.query(query)
        results = job.result()

        video_ids = [row.videoID for row in results]
        logger.info(f"Found {len(video_ids)} unique incomplete videos")
        return video_ids
