import datetime
import logging
from google.cloud import storage
from .config import settings

logger = logging.getLogger(__name__)

def generate_signed_url(blob_name: str, expiration_minutes: int = 60) -> str:
    """Generates a signed URL for a GCS blob."""
    try:
        storage_client = storage.Client(project=settings.PROJECT_ID)
        bucket = storage_client.bucket(settings.BUCKET_NAME)
        blob = bucket.blob(blob_name)

        if not blob.exists():
            logger.warning(f"Blob {blob_name} not found in {settings.BUCKET_NAME}")
            return None

        url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=expiration_minutes),
            method="GET",
        )
        return url
    except Exception as e:
        logger.error(f"Failed to generate signed URL for {blob_name}: {e}")
        return None
