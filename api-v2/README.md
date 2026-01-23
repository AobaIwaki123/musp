# MuSP API v2

以下を担当する軽量なFastAPIサーバーです：
1.  **タスク登録**: YouTube URLを受け取り、BigQueryにタスクを登録します。
2.  **ワーカー起動**: Cloud Functions (`vm-launcher`) をトリガーして、Spot VMワーカーを起動します。
3.  **URL管理**: 処理済み音源のGCS署名付きURLを発行・更新します。

## インフラ概要

- **実行環境**: Cloud Run (または Kubernetes)
- **データベース**: BigQuery (`userID-videoID`, `videoID-status` 等)
- **ワーカー**: Cloud Functions (`vm-launcher`) へのHTTPリクエスト経由で起動

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|---|---|---|
| `GOOGLE_CLOUD_PROJECT` | GCP プロジェクト ID | `test-project` |
| `DATASET_ID` | BigQuery データセット ID | `musp` |
| `BUCKET_NAME` | 音源ファイル用 GCS バケット名 | `musp-bucket` |
| `WORKER_LAUNCHER_URL` | `vm-launcher` Cloud Function の URL | `http://localhost:8080` |

## ローカル開発

### 必要要件
- Docker
- GCP 認証情報 (ADC)

### 実行方法
```bash
docker build -t api-v2 .
docker run -p 8080:8080 \
  -e GOOGLE_CLOUD_PROJECT=your-project \
  -e DATASET_ID=musp_v3 \
  -e BUCKET_NAME=your-bucket \
  -e WORKER_LAUNCHER_URL=https://... \
  -v ~/.config/gcloud:/root/.config/gcloud \
  api-v2
```
