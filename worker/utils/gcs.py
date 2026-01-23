"""Google Cloud Storage utilities for the worker."""

import datetime
import logging
import os
from typing import Optional

from google.cloud import storage

logger = logging.getLogger(__name__)


class GCSClient:
    """Google Cloud Storage client for worker operations."""

    def __init__(
        self,
        bucket_name: Optional[str] = None,
    ):
        """
        Initialize the GCS client.

        Args:
            bucket_name: GCS bucket name. Defaults to BUCKET_NAME env var.
        """
        self.bucket_name = bucket_name or os.getenv("BUCKET_NAME")
        self.client = storage.Client()

        if not self.bucket_name:
            raise ValueError("bucket_name is required")

        self.bucket = self.client.bucket(self.bucket_name)

    def upload_file(
        self,
        source_path: str,
        destination_blob_name: str,
    ) -> str:
        """
        Upload a file to GCS.

        Args:
            source_path: Local path to the file.
            destination_blob_name: Destination path in GCS.

        Returns:
            The GCS URI (gs://bucket/path).
        """
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_filename(source_path)

        gcs_uri = f"gs://{self.bucket_name}/{destination_blob_name}"
        logger.info(f"Uploaded {source_path} to {gcs_uri}")

        return gcs_uri
