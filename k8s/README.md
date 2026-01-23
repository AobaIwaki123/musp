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

```bash
kubectl create secret generic musp-secret \
  --from-file=key.json=secret/musp-api-sa.json \
  --namespace=musp
```

This secret is mounted to the API container at `/root/secret/key.json`.

### 3. Deploy Applications

```bash
$ argocd app create -f k8s/app.yaml
```
