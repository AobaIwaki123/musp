#!/bin/bash
set -e

# Default values
PROJECT_ID="musp-485206"
REGION="asia-northeast1"
# Service Accounts
# 1. Cloud Functionの実行用権限 (VM起動権限など)
FUNCTION_SA="musp-cf-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Deploying vm-launcher to Project: $PROJECT_ID, Region: $REGION..."

gcloud functions deploy vm-launcher \
    --gen2 \
    --runtime python312 \
    --trigger-http \
    --entry-point launch_worker_vm \
    --region $REGION \
    --project $PROJECT_ID \
    --service-account $FUNCTION_SA \
    --source cloud-functions/vm-launcher \
    --env-vars-file cloud-functions/vm-launcher/.env.yaml \
    --memory 512MB \
    --timeout 540s \
    --allow-unauthenticated

echo "Deployment submitted."
