"""Task: Cleanup temporary files and delete the VM instance."""

import logging
import shutil
from pathlib import Path
from typing import Optional

from google.cloud import compute_v1

from utils.metadata import get_instance_name, get_project_id, get_zone

logger = logging.getLogger(__name__)


def cleanup_temp_files(video_id: str, work_dir: str) -> None:
    """
    Remove temporary files for a video.

    Args:
        video_id: The YouTube video ID.
        work_dir: Working directory containing temporary files.
    """
    video_dir = Path(work_dir) / video_id

    try:
        if video_dir.exists():
            shutil.rmtree(video_dir)
            logger.info(f"Deleted temporary directory: {video_dir}")
    except Exception as e:
        logger.warning(f"Failed to delete temporary directory {video_dir}: {e}")


def delete_self() -> None:
    """
    Delete the current VM instance.

    This is called after processing is complete to clean up the Spot VM.
    """
    project_id = get_project_id()
    zone = get_zone()
    instance_name = get_instance_name()

    if not all([project_id, zone, instance_name]):
        logger.warning(
            "Cannot delete VM: missing project_id, zone, or instance_name. "
            "This is expected in local development."
        )
        return

    logger.info(f"Deleting VM instance: {instance_name} in {zone}")

    try:
        client = compute_v1.InstancesClient()
        operation = client.delete(
            project=project_id,
            zone=zone,
            instance=instance_name,
        )
        logger.info(f"VM deletion initiated: {operation.name}")
    except Exception as e:
        logger.error(f"Failed to delete VM {instance_name}: {e}")


def cleanup(
    video_id: str,
    work_dir: str,
    delete_vm: bool = True,
) -> None:
    """
    Perform cleanup after processing.

    Args:
        video_id: The YouTube video ID.
        work_dir: Working directory containing temporary files.
        delete_vm: Whether to delete the VM instance.
    """
    cleanup_temp_files(video_id, work_dir)

    if delete_vm:
        delete_self()
