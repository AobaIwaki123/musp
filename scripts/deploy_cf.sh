#!/bin/bash
set -e

gcloud functions deploy vm-launcher \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast1 \
  --source=cloud-functions/vm-launcher \
  --entry-point=launch_worker_vm \
  --trigger-http \
  --allow-unauthenticated \
  --env-vars-file=cloud-functions/vm-launcher/.env.yaml \
  --timeout=540s \
  --memory=512MB \
  --project=musp-485206

echo "Deployment submitted."
