import functions_framework
import logging
import os
import datetime
from google.cloud import compute_v1
from google.cloud import bigquery

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment Variables
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT")
ZONE = os.environ.get("ZONE", "asia-northeast1-c")
DATASET_ID = os.environ.get("DATASET_ID", "musp_v3")
TABLE_NAME = "videoID-status"
WORKER_IMAGE = os.environ.get("WORKER_IMAGE", f"gcr.io/{PROJECT_ID}/musp-worker:latest")
# Default to Compute Engine default service account if not specified, 
# but usually we want a specific one for least privilege.
WORKER_SA_EMAIL = os.environ.get("WORKER_SA_EMAIL") 

@functions_framework.http
def launch_worker_vm(request):
    """
    HTTP Cloud Function to launch a Spot VM worker.
    
    Payload:
        {"trigger": "api" | "cron"}
    
    Logic:
        1. Check if a worker VM is already running. If so, exit.
        2. If trigger == 'api': Launch VM.
        3. If trigger == 'cron':
            - Check BigQuery for incomplete tasks.
            - Check BigQuery for last execution time (started_at).
            - If (tasks > 0) AND (last_run is None OR Now - last_run > 1 hour): Launch VM.
    """
    # 0. Parse Request
    request_json = request.get_json(silent=True)
    if not request_json:
        return {"status": "error", "message": "Invalid JSON payload"}, 400
    
    trigger = request_json.get("trigger", "api") # Default to 'api' if not specified? Or fail? Let's default to safe 'api' or maybe 'cron'? 
                                                # Actually, 'api' implies user action, so maybe strict parsing is better.
                                                # Let's assume 'api' for now as manual invoke.
    
    logger.info(f"Received request with trigger: {trigger}")

    # 1. Check for running instances (to avoid duplicates)
    if is_worker_running(PROJECT_ID, ZONE):
        logger.info("Worker VM is already running. Skipping launch.")
        return {"status": "skipped", "reason": "Worker already running"}, 200

    # 2. Evaluate Trigger Conditions
    should_launch = False
    
    if trigger == "api":
        logger.info("Trigger is 'api'. Launching immediately.")
        should_launch = True
    elif trigger == "cron":
        logger.info("Trigger is 'cron'. Checking conditions...")
        bq_client = bigquery.Client(project=PROJECT_ID)
        
        # Check incomplete tasks count
        incomplete_count = get_incomplete_tasks_count(bq_client, PROJECT_ID, DATASET_ID, TABLE_NAME)
        logger.info(f"Incomplete tasks count: {incomplete_count}")
        
        if incomplete_count > 0:
            # Check last execution time
            last_started_at = get_last_execution_time(bq_client, PROJECT_ID, DATASET_ID, TABLE_NAME)
            logger.info(f"Last execution time: {last_started_at}")
            
            if last_started_at is None:
                logger.info("No previous execution found. Launching.")
                should_launch = True
            else:
                # Calculate time difference
                # Ensure UTC for comparison
                now = datetime.datetime.now(datetime.timezone.utc)
                diff = now - last_started_at
                logger.info(f"Time since last execution: {diff}")
                
                if diff > datetime.timedelta(hours=1):
                    logger.info("More than 1 hour since last execution. Launching.")
                    should_launch = True
                else:
                    logger.info("Less than 1 hour since last execution. Skipping.")
        else:
            logger.info("No incomplete tasks. Skipping.")
            
    else:
         return {"status": "error", "message": f"Unknown trigger: {trigger}"}, 400

    # 3. Launch VM if conditions met
    if should_launch:
        try:
            instance_name = launch_vm(PROJECT_ID, ZONE, WORKER_IMAGE, WORKER_SA_EMAIL)
            logger.info(f"Launched instance: {instance_name}")
            return {"status": "launched", "instance": instance_name}, 200
        except Exception as e:
            logger.error(f"Failed to launch VM: {e}")
            return {"status": "error", "message": str(e)}, 500
    
    return {"status": "skipped", "reason": "Conditions not met"}, 200


def is_worker_running(project_id, zone):
    """Checks if any instance name starting with 'musp-worker-' is currently running."""
    # Note: Use list(filter=...) is a simple way, but filtering server-side is better if possible.
    # The client library `list` returns an iterable. 
    # We'll filter client-side for simplicity unless list is huge (unlikely for spot workers).
    # But wait, we can assume we only have one or few.
    
    instance_client = compute_v1.InstancesClient()
    # Paging technically, but usually only a few instances.
    request = compute_v1.ListInstancesRequest(project=project_id, zone=zone)
    # We could use filter="name:musp-worker-*" but the API filter syntax is a bit specific.
    # Let's list all and filter in python for now to be safe, or use simple filter.
    # Filter syntax: 'name eq "pattern"' doesn't support wildcards fully in simple way sometimes.
    # However, `name = musp-worker*` works in gcloud, API uses `name eq ...`.
    # Let's just iterate, it's safer for small number of VMs.
    
    instances = instance_client.list(request=request)
    for instance in instances:
        if instance.name.startswith("musp-worker-") and instance.status in ("PROVISIONING", "STAGING", "RUNNING", "REPAIRING"):
             return True
    return False

def get_incomplete_tasks_count(client, project_id, dataset_id, table_name):
    query = f"""
        SELECT COUNT(*) as count
        FROM `{project_id}.{dataset_id}.{table_name}`
        WHERE status != 'COMPLETED'
    """
    job = client.query(query)
    result = job.result()
    for row in result:
        return row.count
    return 0

def get_last_execution_time(client, project_id, dataset_id, table_name):
    # Retrieve the MAX(started_at) from the table
    query = f"""
        SELECT MAX(startedAt) as last_start
        FROM `{project_id}.{dataset_id}.{table_name}`
    """
    job = client.query(query)
    result = job.result()
    for row in result:
        return row.last_start # Returns datetime or None
    return None

def launch_vm(project_id, zone, image, sa_email):
    instance_client = compute_v1.InstancesClient()
    
    # Generate unique name
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    instance_name = f"musp-worker-{timestamp}"
    
    # Define Machine Type
    machine_type = f"zones/{zone}/machineTypes/n1-standard-4"
    
    # Define Accelerator (T4)
    accelerator_type = f"zones/{zone}/acceleratorTypes/nvidia-tesla-t4"
    
    # Instance Config
    config = {
        "name": instance_name,
        "machine_type": machine_type,
        "scheduling": {
            "provisioning_model": "SPOT", # Or PREEMPTIBLE if older lib
            "on_host_maintenance": "TERMINATE",
            "automatic_restart": False
        },
        "guest_accelerators": [{
            "accelerator_type": accelerator_type,
            "accelerator_count": 1
        }],
        "disks": [{
            "boot": True,
            "auto_delete": True,
            "initialize_params": {
                "source_image": "projects/cos-cloud/global/images/family/cos-stable", # Container-Optimized OS
                "disk_size_gb": 50
            }
        }],
        "network_interfaces": [{
            "network": "global/networks/default",
            "access_configs": [{"type": "ONE_TO_ONE_NAT", "name": "External NAT"}]
        }],
        "metadata": {
            "items": [
                 {
                    "key": "gce-container-declaration",
                    "value": f"spec:\n  containers:\n    - image: {image}\n      stdin: false\n      tty: false\n      restartPolicy: Always\n" 
                    # Note: We might want env vars here if needed, but worker pulls from BQ.
                 },
                 {
                     "key": "google-logging-enabled",
                     "value": "true"
                 }
            ]
        },
        # Service Account
        "service_accounts": [{
            "email": sa_email if sa_email else "default",
            "scopes": ["https://www.googleapis.com/auth/cloud-platform"]
        }]
    }

    # Insert Instance
    operation = instance_client.insert(
        project=project_id,
        zone=zone,
        instance_resource=config
    )
    
    operation.result() # Wait for operation to complete (blocking)
    return instance_name
