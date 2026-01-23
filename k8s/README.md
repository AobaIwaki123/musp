# MuSP K8s Deployment

## Prerequisites
- `kubectl` installed
- GCP Service Account Key (JSON) available locally

## Setup

### 1. Create Namespace
```bash
kubectl apply -f k8s/manifests/namespace.yaml
```

### 2. Configure Secrets (GCP Credential)
Create a Kubernetes secret for the GCP Service Account key.
Replace `PATH_TO_YOUR_KEY_FILE.json` with the actual path to your downloaded JSON key.

```bash
kubectl create secret generic musp-secret \
  --from-file=key.json=PATH_TO_YOUR_KEY_FILE.json \
  --namespace=musp
```

This secret is mounted to the API container at `/root/secret/key.json`.

### 3. Deploy Applications
```bash
kubectl apply -f k8s/manifests/configmap.yaml
kubectl apply -f k8s/manifests/api-deployment.yaml
kubectl apply -f k8s/manifests/api-service.yaml
kubectl apply -f k8s/manifests/view-deployment.yaml
kubectl apply -f k8s/manifests/view-service.yaml
# kubectl apply -f k8s/manifests/ingress.yaml (If available)
```
