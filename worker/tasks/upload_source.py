"""Task: Upload separated audio files to GCS."""

import logging
from typing import Tuple

from utils.gcs import GCSClient

logger = logging.getLogger(__name__)


def upload_source(
    video_id: str,
    vocal_path: str,
    inst_path: str,
    gcs_client: GCSClient,
) -> Tuple[str, str]:
    """
    Upload vocal and instrumental files to GCS.

    Args:
        video_id: The YouTube video ID.
        vocal_path: Local path to the vocal WAV file.
        inst_path: Local path to the instrumental WAV file.
        gcs_client: GCS client instance.

    Returns:
        Tuple of (vocal_gcs_uri, inst_gcs_uri).
    """
    logger.info(f"Uploading files for video: {video_id}")

    # Upload vocal
    vocal_blob_name = f"{video_id}/vocals.wav"
    vocal_uri = gcs_client.upload_file(vocal_path, vocal_blob_name)

    # Upload instrumental
    inst_blob_name = f"{video_id}/no_vocals.wav"
    inst_uri = gcs_client.upload_file(inst_path, inst_blob_name)

    logger.info(f"Upload complete: vocals={vocal_uri}, inst={inst_uri}")
    return vocal_uri, inst_uri
