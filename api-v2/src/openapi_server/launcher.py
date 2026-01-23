import requests
import logging
from .config import settings

logger = logging.getLogger(__name__)

def trigger_worker():
    """Triggers the worker VM via Cloud Function."""
    url = settings.WORKER_LAUNCHER_URL
    payload = {"trigger": "api"}
    
    try:
        logging.info(f"Triggering worker at {url}")
        # In a real GCF environment with authentication, we might need to add identity token headers.
        # For now, assuming unauthenticated or internal or handling auth if needed later.
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        logging.info(f"Worker triggered successfully: {response.text}")
    except Exception as e:
        # We don't want to fail the API request if the trigger fails, 
        # but we should log it. The task is already in BQ so Cron will pick it up eventually.
        logging.error(f"Failed to trigger worker: {e}")
