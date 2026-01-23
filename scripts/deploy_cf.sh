#!/bin/bash
set -e

# Default values
PROJECT_ID="musp-485206"
REGION="asia-northeast1"
# Service Accounts
# 1. Cloud Functionの実行用権限 (VM起動権限など)
FUNCTION_SA="musp-cf-sa@${PROJECT_ID}.iam.gserviceaccount.com"
# 2. Worker VMそのものに付与する権限 (GCS書き込み権限など)
WORKER_SA="musp-worker-sa@${PROJECT_ID}.iam.gserviceaccount.com"

ZONE="asia-northeast1-c"
DATASET_ID="musp_v3"

echo "Deploying vm-launcher to Project: $PROJECT_ID, Region: $REGION..."

gcloud functions deploy vm-launcher \
    --gen2 \
    --runtime python311 \
    --trigger-http \
    --entry-point launch_worker_vm \
    --region $REGION \
    --project $PROJECT_ID \
    --service-account $FUNCTION_SA \
    --source cloud-functions/vm-launcher \
    --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID,ZONE=$ZONE,DATASET_ID=$DATASET_ID,WORKER_SA_EMAIL=$WORKER_SA \
    --memory 512MiB \
    --allow-unauthenticated

echo "Deployment submitted."
