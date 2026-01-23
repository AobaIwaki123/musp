# MuSP GCP + K8s 移行計画

## 概要

現在のDocker Compose + Celeryアーキテクチャから、ARCH.mdで定義されたGCP + ローカルK8sアーキテクチャへ移行する。

### 現在のアーキテクチャ
```
view (Next.js) → api (FastAPI) → celery (GPU Worker) → BigQuery/GCS
                                      ↑
                                    redis
```

### 目標アーキテクチャ
```
[Local K8s]                    [GCP - プロジェクトA: K8s用]
┌─────────────────┐            ┌─────────────────────────────────┐
│ API Server      │←──pull────│ GCR (API, Task Launcher Image)  │
│ CronJob         │            └─────────────────────────────────┘
└────────┬────────┘
         │                     [GCP - プロジェクトB: メイン]
         │                     ┌─────────────────────────────────┐
         └────────────────────→│ BigQuery (Task Management)      │
                               │ Cloud Functions (VM Orchestrator)│
                               │ Spot VM + GPU (Worker)          │
                               │ GCS (Input/Output Data)         │
                               │ GCR (Worker Image) ←同一PJ=認証簡略│
                               └─────────────────────────────────┘
```

### GCPプロジェクト構成
| プロジェクト | 用途 | リソース |
|-------------|------|----------|
| **プロジェクトA** | K8sイメージ管理（既存） | GCR: `musp-api`, `musp-task-launcher` |
| **プロジェクトB** | MuSPメイン | BigQuery, GCS, Cloud Functions, Spot VM, GCR: `musp-worker` |

**イメージ配置の理由**:
- ローカルK8s → プロジェクトA: 既存のK8s運用フローを活用、imagePullSecretsで認証
- Spot VM → プロジェクトB: 同一プロジェクト内でpull、デフォルトCompute Engine SAで認証OK、低レイテンシ

---

## Phase 1: インフラ基盤の準備

### 1.1 GCPプロジェクト設定

#### プロジェクトA（K8sイメージ管理・既存）
- [ ] Container Registry API 有効化確認
- [ ] サービスアカウントの作成/確認
  - `musp-k8s-pull-sa`: ローカルK8sからのイメージpull用（GCR読み取り権限）

#### プロジェクトB（MuSPメイン）
- [ ] 必要なAPIの有効化
  - Compute Engine API
  - Cloud Functions API
  - Container Registry API
  - Cloud Build API
  - BigQuery API (既存)
  - Cloud Storage API (既存)
- [ ] サービスアカウントの作成
  - `musp-api-sa`: API Server用（BigQuery読み書き）
  - `musp-worker-sa`: Spot VM用（BigQuery読み書き、GCS読み書き、同一PJ内GCRはデフォルトでOK）
  - `musp-cf-sa`: Cloud Functions用（Compute Engine管理）

### 1.2 BigQueryスキーマ拡張
現在のテーブル:
- `googleID-userID`: ユーザーマッピング
- `userID-videoID`: ユーザー・動画紐付け
- `videoID-status`: 処理ステータス
- `videoID-vocalWavURL`: ボーカルURL
- `videoID-instWavURL`: インスト URL

追加フィールド（`videoID-status`テーブル）:
```sql
ALTER TABLE `videoID-status`
ADD COLUMN IF NOT EXISTS vm_instance_name STRING,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS error_message STRING;
```

### 1.3 ネットワーク設定
- [ ] VPCネットワーク作成（またはdefault使用）
- [ ] Firewall rules設定（内部通信のみ許可）
- [ ] Cloud NATの設定（Spot VMの外部アクセス用）

---

## Phase 2: Worker Image作成

### 2.1 ディレクトリ構造
```
worker/
├── Dockerfile
├── requirements.txt
├── main.py              # エントリーポイント
├── tasks/
│   ├── __init__.py
│   ├── fetch_source.py
│   ├── separate_source.py
│   ├── upload_source.py
│   └── update_status.py
└── utils/
    ├── __init__.py
    ├── bigquery.py
    └── gcs.py
```

### 2.2 Worker Dockerfile
```dockerfile
FROM nvidia/cuda:12.1-cudnn8-runtime-ubuntu22.04

# 依存関係インストール
RUN apt-get update && apt-get install -y \
    python3 python3-pip ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

# メタデータからvideo_idを取得して処理
ENTRYPOINT ["python3", "main.py"]
```

### 2.3 Worker main.py 処理フロー
```python
def main():
    # 1. GCEメタデータからvideo_idを取得
    video_id = get_metadata("video_id")

    # 2. BigQueryでステータスをPROCESSINGに更新
    update_status(video_id, "PROCESSING")

    try:
        # 3. YouTubeからダウンロード
        audio_path = fetch_source(video_id)

        # 4. Demucsで分離
        vocal_path, inst_path = separate_source(audio_path)

        # 5. GCSにアップロード
        vocal_url = upload_to_gcs(vocal_path, f"{video_id}/vocal.wav")
        inst_url = upload_to_gcs(inst_path, f"{video_id}/inst.wav")

        # 6. BigQueryにURL保存 & ステータス更新
        save_urls(video_id, vocal_url, inst_url)
        update_status(video_id, "COMPLETED")

    except Exception as e:
        update_status(video_id, "FAILED", error=str(e))

    # 7. 自身のVMを削除
    delete_self()
```

### 2.4 GCRへのプッシュ（プロジェクトB）
```bash
# ビルド & プッシュ（プロジェクトB: MuSPメイン）
# Spot VMと同一プロジェクトなので認証不要でpull可能
gcloud builds submit --project ${PROJECT_B_ID} \
    --tag gcr.io/${PROJECT_B_ID}/musp-worker:latest worker/
```

---

## Phase 3: Cloud Functions (VM Orchestrator)

### 3.1 ディレクトリ構造
```
cloud-functions/
├── vm-launcher/
│   ├── main.py
│   └── requirements.txt
```

### 3.2 VM Launcher実装
```python
import functions_framework
from google.cloud import compute_v1

@functions_framework.http
def launch_worker_vm(request):
    """
    リクエスト: {"video_id": "xxx", "youtube_url": "..."}
    """
    data = request.get_json()
    video_id = data["video_id"]
    youtube_url = data["youtube_url"]

    instance_client = compute_v1.InstancesClient()

    # Spot VM設定
    config = {
        "name": f"musp-worker-{video_id}",
        "machine_type": f"zones/{ZONE}/machineTypes/n1-standard-4",
        "scheduling": {
            "provisioning_model": "SPOT",
            "on_host_maintenance": "TERMINATE",
            "automatic_restart": False
        },
        "guest_accelerators": [{
            "accelerator_type": f"zones/{ZONE}/acceleratorTypes/nvidia-tesla-t4",
            "accelerator_count": 1
        }],
        "disks": [{
            "boot": True,
            "auto_delete": True,
            "initialize_params": {
                "source_image": "projects/cos-cloud/global/images/family/cos-stable"
            }
        }],
        "network_interfaces": [{
            "network": "global/networks/default",
            "access_configs": [{"type": "ONE_TO_ONE_NAT"}]
        }],
        "metadata": {
            "items": [
                {"key": "video_id", "value": video_id},
                {"key": "youtube_url", "value": youtube_url},
                {"key": "gce-container-declaration", "value": f"""
                    spec:
                      containers:
                        - image: gcr.io/{PROJECT_B_ID}/musp-worker:latest
                          env:
                            - name: VIDEO_ID
                              value: {video_id}
                            - name: YOUTUBE_URL
                              value: {youtube_url}
                """}
                # 注: PROJECT_B_ID と Spot VM は同一プロジェクトなので
                # デフォルトの Compute Engine SA で認証不要でpull可能
            ]
        },
        "service_accounts": [{
            "email": WORKER_SA_EMAIL,
            "scopes": ["https://www.googleapis.com/auth/cloud-platform"]
        }]
    }

    operation = instance_client.insert(
        project=PROJECT_ID,
        zone=ZONE,
        instance_resource=config
    )

    return {"status": "launched", "instance": f"musp-worker-{video_id}"}
```

### 3.3 デプロイ
```bash
gcloud functions deploy vm-launcher \
    --gen2 \
    --runtime python311 \
    --trigger-http \
    --entry-point launch_worker_vm \
    --service-account ${CF_SA_EMAIL} \
    --region ${REGION}
```

---

## Phase 4: K8s マニフェスト作成

### 4.1 ディレクトリ構造
```
k8s/
├── base/
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   ├── cronjob.yaml
│   ├── configmap.yaml
│   └── secret.yaml (gitignore)
└── overlays/
    └── local/
        ├── kustomization.yaml
        └── patches/
```

### 4.2 API Server Deployment
```yaml
# k8s/base/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: musp-api
  namespace: musp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: musp-api
  template:
    metadata:
      labels:
        app: musp-api
    spec:
      serviceAccountName: musp-api-sa
      imagePullSecrets:
      - name: gcr-secret  # プロジェクトAのGCRからpullするための認証
      containers:
      - name: api
        image: gcr.io/PROJECT_A_ID/musp-api:latest  # プロジェクトA
        ports:
        - containerPort: 8000
        env:
        - name: GOOGLE_CLOUD_PROJECT
          valueFrom:
            configMapKeyRef:
              name: musp-config
              key: project_id
        - name: DATASET_ID
          valueFrom:
            configMapKeyRef:
              name: musp-config
              key: dataset_id
        - name: CLOUD_FUNCTION_URL
          valueFrom:
            configMapKeyRef:
              name: musp-config
              key: cloud_function_url
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4.3 API Service
```yaml
# k8s/base/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: musp-api
  namespace: musp
spec:
  type: LoadBalancer  # ローカルではNodePort
  selector:
    app: musp-api
  ports:
  - port: 80
    targetPort: 8000
```

### 4.4 CronJob (Task Launcher)
```yaml
# k8s/base/cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: musp-task-launcher
  namespace: musp
spec:
  schedule: "*/5 * * * *"  # 5分ごと
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: musp-api-sa
          imagePullSecrets:
          - name: gcr-secret  # プロジェクトAのGCRからpullするための認証
          containers:
          - name: task-launcher
            image: gcr.io/PROJECT_A_ID/musp-task-launcher:latest  # プロジェクトA
            env:
            - name: GOOGLE_CLOUD_PROJECT
              valueFrom:
                configMapKeyRef:
                  name: musp-config
                  key: project_id
            - name: DATASET_ID
              valueFrom:
                configMapKeyRef:
                  name: musp-config
                  key: dataset_id
            - name: CLOUD_FUNCTION_URL
              valueFrom:
                configMapKeyRef:
                  name: musp-config
                  key: cloud_function_url
          restartPolicy: OnFailure
```

### 4.5 ConfigMap
```yaml
# k8s/base/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: musp-config
  namespace: musp
data:
  # プロジェクトA: K8sイメージ管理
  project_a_id: "your-k8s-image-project-id"
  # プロジェクトB: MuSPメイン（BigQuery, GCS, Spot VM, Worker Image）
  project_b_id: "your-musp-main-project-id"
  dataset_id: "musp_dataset"
  cloud_function_url: "https://REGION-PROJECT_B_ID.cloudfunctions.net/vm-launcher"
  gcs_bucket: "musp-audio-bucket"
```

### 4.6 imagePullSecret作成手順
```bash
# プロジェクトAのGCRからpullするためのSecret
# musp-k8s-pull-sa のキーを使用
kubectl create secret docker-registry gcr-secret \
  --docker-server=gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat ./secret/project-a-sa-key.json)" \
  --docker-email=any@email.com \
  -n musp
```

---

## Phase 5: API Server修正

### 5.1 Celery依存の削除
現在の`POST /video`フローを修正:

**Before (Celery)**:
```python
# process_source をCeleryタスクとして実行
result = process_source.delay(data)
```

**After (BigQuery + pending)**:
```python
# BigQueryにpendingとして登録するのみ
insert_video_status(video_id, status="PENDING")
```

### 5.2 ファイル変更一覧
```
api/src/
├── openapi_server/
│   ├── impl/
│   │   └── video_api_impl.py  # Celery呼び出し削除
│   ├── process_source/        # 削除（workerに移動）
│   └── ...
├── celery_server/             # 削除
└── ...
```

### 5.3 requirements.txt更新
削除:
- celery
- redis
- watchdog

追加:
- google-cloud-functions (API呼び出し用、オプション)

---

## Phase 6: Task Launcher実装

### 6.1 処理フロー
```python
# task-launcher/main.py
def main():
    # 1. BigQueryからPENDINGタスクを取得
    pending_tasks = query_pending_tasks()

    for task in pending_tasks:
        # 2. 既にVMが起動していないか確認
        if not is_vm_running(task.video_id):
            # 3. Cloud Functionsを呼び出してVM起動
            launch_vm(task.video_id, task.youtube_url)

            # 4. ステータスをQUEUEDに更新
            update_status(task.video_id, "QUEUED")
```

### 6.2 Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["python", "main.py"]
```

---

## Phase 7: ローカルK8s環境構築

### 7.1 必要なツール
- Docker Desktop with Kubernetes または
- Minikube / kind / k3s

### 7.2 セットアップスクリプト
```bash
#!/bin/bash
# scripts/setup-local-k8s.sh

# Namespaceの作成
kubectl apply -f k8s/base/namespace.yaml

# Secretの作成（プロジェクトBのGCPサービスアカウントキー：BigQuery/GCS/CF用）
kubectl create secret generic gcp-sa-key \
    --from-file=key.json=./secret/project-b-sa-key.json \
    -n musp

# imagePullSecret作成（プロジェクトAのGCRからpull用）
kubectl create secret docker-registry gcr-secret \
    --docker-server=gcr.io \
    --docker-username=_json_key \
    --docker-password="$(cat ./secret/project-a-sa-key.json)" \
    --docker-email=any@email.com \
    -n musp

# Kustomizeでデプロイ
kubectl apply -k k8s/overlays/local/
```

### 7.3 ローカル用パッチ
```yaml
# k8s/overlays/local/patches/service-patch.yaml
apiVersion: v1
kind: Service
metadata:
  name: musp-api
  namespace: musp
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 8000
    nodePort: 30080
```

---

## Phase 8: CI/CD設定

### 8.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

env:
  PROJECT_A_ID: ${{ vars.GCP_PROJECT_A_ID }}  # K8sイメージ管理
  PROJECT_B_ID: ${{ vars.GCP_PROJECT_B_ID }}  # MuSPメイン

jobs:
  # プロジェクトA: K8s用イメージ（API, Task Launcher）
  build-k8s-images:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: google-github-actions/auth@v2
      with:
        credentials_json: ${{ secrets.GCP_PROJECT_A_SA_KEY }}
    - name: Build and push API image to Project A
      run: |
        gcloud builds submit --project $PROJECT_A_ID \
          --tag gcr.io/$PROJECT_A_ID/musp-api:$GITHUB_SHA api/
    - name: Build and push Task Launcher image to Project A
      run: |
        gcloud builds submit --project $PROJECT_A_ID \
          --tag gcr.io/$PROJECT_A_ID/musp-task-launcher:$GITHUB_SHA task-launcher/

  # プロジェクトB: Worker用イメージ（Spot VMと同一プロジェクト）
  build-worker:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: google-github-actions/auth@v2
      with:
        credentials_json: ${{ secrets.GCP_PROJECT_B_SA_KEY }}
    - name: Build and push Worker image to Project B
      run: |
        gcloud builds submit --project $PROJECT_B_ID \
          --tag gcr.io/$PROJECT_B_ID/musp-worker:$GITHUB_SHA worker/

  # プロジェクトB: Cloud Functions
  deploy-cf:
    needs: [build-worker]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: google-github-actions/auth@v2
      with:
        credentials_json: ${{ secrets.GCP_PROJECT_B_SA_KEY }}
    - name: Deploy Cloud Functions to Project B
      run: |
        gcloud functions deploy vm-launcher \
          --project $PROJECT_B_ID \
          --source cloud-functions/vm-launcher \
          --gen2 --runtime python311 \
          --trigger-http
```

### 8.2 GitHub Secrets/Variables設定
| 種別 | 名前 | 説明 |
|------|------|------|
| Variable | `GCP_PROJECT_A_ID` | K8sイメージ管理プロジェクトID |
| Variable | `GCP_PROJECT_B_ID` | MuSPメインプロジェクトID |
| Secret | `GCP_PROJECT_A_SA_KEY` | プロジェクトA用サービスアカウントキー (JSON) |
| Secret | `GCP_PROJECT_B_SA_KEY` | プロジェクトB用サービスアカウントキー (JSON) |

---

## Phase 9: 移行手順

### 9.1 移行チェックリスト

#### 準備フェーズ
- [ ] プロジェクトA: GCR読み取り用SA作成 (`musp-k8s-pull-sa`)
- [ ] プロジェクトB: API/Worker/CF用SA作成
- [ ] プロジェクトB: BigQueryスキーマ更新
- [ ] プロジェクトB: GCSバケット確認

#### ビルドフェーズ
- [ ] プロジェクトA: API Image作成・プッシュ
- [ ] プロジェクトA: Task Launcher Image作成・プッシュ
- [ ] プロジェクトB: Worker Image作成・プッシュ
- [ ] プロジェクトB: Cloud Functions デプロイ

#### デプロイフェーズ
- [ ] imagePullSecret作成（プロジェクトA GCR用）
- [ ] K8sマニフェスト適用
- [ ] イメージpull確認
- [ ] ヘルスチェック確認
- [ ] E2Eテスト実行

#### 切り替えフェーズ
- [ ] DNS切り替え（またはロードバランサー設定）
- [ ] 旧環境の停止
- [ ] 監視・アラート設定

### 9.2 ロールバック計画
1. K8sデプロイメントを前バージョンに戻す
2. Cloud Functionsを無効化
3. 旧Docker Compose環境を再起動

---

## ファイル作成一覧

```
musp/
├── worker/                      # 新規: GPUワーカー
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   └── tasks/
├── task-launcher/               # 新規: CronJobコンテナ
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
├── cloud-functions/             # 新規: Cloud Functions
│   └── vm-launcher/
│       ├── main.py
│       └── requirements.txt
├── k8s/                         # 新規: K8sマニフェスト（ローカル用）
│   ├── base/
│   └── overlays/local/
├── scripts/                     # 新規: セットアップスクリプト
│   ├── setup-gcp.sh
│   ├── setup-local-k8s.sh
│   └── deploy.sh
└── api/                         # 修正: Celery依存削除
    └── src/
```

---

## コスト見積もり

| リソース | 仕様 | 月額概算 |
|---------|------|----------|
| Spot VM (T4 GPU) | n1-standard-4 + T4 × 処理時間 | $50-100 (使用量依存) |
| Cloud Functions | 呼び出し回数依存 | $5-10 |
| Local K8s | Minikube/kind/k3s | $0 |
| BigQuery | 既存 | 変動なし |
| GCS | 既存 | 変動なし |

**Spot VMのメリット**: 通常VMの60-90%オフ

---

## 次のアクション

1. **Phase 1から順番に実装** - インフラ基盤が最優先
2. **Worker Imageを先に完成** - 最もクリティカルなコンポーネント
3. **ローカルK8sで動作確認** - 本番デプロイ前にローカルテスト
4. **段階的移行** - 既存環境と並行運用しながら切り替え
