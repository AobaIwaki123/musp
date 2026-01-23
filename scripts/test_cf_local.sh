#!/bin/bash
set -e

# Configuration (match deploy_cf.sh defaults or use local mock values)
export PROJECT_ID="musp-485206"
export GOOGLE_CLOUD_PROJECT=$PROJECT_ID
export ZONE="asia-northeast1-c"
export DATASET_ID="musp_v3"
export WORKER_IMAGE="mock-image"
export WORKER_SA_EMAIL="mock-sa@example.com"
export FUNCTION_TARGET="launch_worker_vm"
export SOURCE="cloud-functions/vm-launcher/main.py"

echo "Starting functions-framework for ${FUNCTION_TARGET}..."
echo "Project: $PROJECT_ID"
echo "Zone: $ZONE"

# Check if functions-framework is installed
if ! command -v functions-framework &> /dev/null; then
    echo "Error: functions-framework is not installed."
    echo "Please install it with: pip install functions-framework"
    exit 1
fi

# Run the function locally
# Listens on localhost:8080 by default
functions-framework --target=$FUNCTION_TARGET --source=$SOURCE --debug
