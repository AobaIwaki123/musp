"""GCE metadata utilities for VM self-deletion."""

import logging
import os
from typing import Optional

import requests

logger = logging.getLogger(__name__)

METADATA_URL = "http://metadata.google.internal/computeMetadata/v1"
METADATA_HEADERS = {"Metadata-Flavor": "Google"}


def get_project_id() -> Optional[str]:
    """
    Get the GCP project ID.

    Returns:
        The project ID or None if not found.
    """
    env_value = os.getenv("GOOGLE_CLOUD_PROJECT")
    if env_value:
        return env_value

    try:
        url = f"{METADATA_URL}/project/project-id"
        response = requests.get(url, headers=METADATA_HEADERS, timeout=5)
        if response.status_code == 200:
            return response.text
    except requests.exceptions.RequestException as e:
        logger.warning(f"Failed to get project ID: {e}")

    return None


def get_zone() -> Optional[str]:
    """
    Get the GCE zone.

    Returns:
        The zone (e.g., 'us-central1-a') or None if not found.
    """
    env_value = os.getenv("ZONE")
    if env_value:
        return env_value

    try:
        url = f"{METADATA_URL}/instance/zone"
        response = requests.get(url, headers=METADATA_HEADERS, timeout=5)
        if response.status_code == 200:
            # Response is like: projects/123456789/zones/us-central1-a
            return response.text.split("/")[-1]
    except requests.exceptions.RequestException as e:
        logger.warning(f"Failed to get zone: {e}")

    return None


def get_instance_name() -> Optional[str]:
    """
    Get the current instance name.

    Returns:
        The instance name or None if not found.
    """
    env_value = os.getenv("INSTANCE_NAME")
    if env_value:
        return env_value

    try:
        url = f"{METADATA_URL}/instance/name"
        response = requests.get(url, headers=METADATA_HEADERS, timeout=5)
        if response.status_code == 200:
            return response.text
    except requests.exceptions.RequestException as e:
        logger.warning(f"Failed to get instance name: {e}")

    return None
