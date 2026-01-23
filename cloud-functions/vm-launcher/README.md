# VM Launcher Cloud Function

## 概要
この Cloud Function は、`musp-worker` 用の Spot VM インスタンスの起動をオーケストレーションします。APIサーバーやスケジューラーと、Compute Engine インフラストラクチャの間のブリッジとして機能します。

## トリガーとロジック
この関数は、`trigger` フィールドを持つ JSON ペイロードを受け取ります: `{"trigger": "api" | "cron"}`。

### 1. API トリガー (`trigger="api"`)
- **ユースケース**: ユーザーや管理者による即時処理リクエスト。
- **動作**: 実行中のワーカーがない場合、即座にワーカーVMを起動します。

### 2. Cron トリガー (`trigger="cron"`)
- **ユースケース**: Cloud Scheduler による定期チェック（例: 1時間ごと）。
- **動作**: 以下の条件を満たす場合にワーカーVMを起動します:
    1. BigQuery に未完了のタスクが存在すること（`status != 'COMPLETED'`）。
    
    ※ 実行間隔の制御は Cloud Scheduler 側の設定（cron式）に委ねられます。

## インフラ構成

### サービスアカウント
| 変数名 | ロール | 権限詳細 |
|--------|--------|----------|
| `FUNCTION_SA` | **Launcher ID**<br>(`musp-cf-sa`) | この関数を実行するID。<br>- `roles/compute.instanceAdmin.v1` (VM作成)<br>- `roles/iam.serviceAccountUser` (Worker SA割り当て)<br>- `roles/bigquery.dataViewer` (タスク確認) |
| `WORKER_SA_EMAIL` | **Worker ID**<br>(`musp-worker-sa`) | 作成された Spot VM に割り当てられるID。<br>- `roles/storage.objectAdmin` (ファイルアップロード)<br>- `roles/bigquery.dataEditor` (ステータス更新) |

### 環境変数
- `PROJECT_ID`: GCP プロジェクト ID。
- `ZONE`: Spot VM を起動する Compute Engine ゾーン（例: `asia-northeast1-c`）。
- `DATASET_ID`: BigQuery データセット ID。
- `WORKER_IMAGE`: ワーカー用コンテナイメージ（例: `gcr.io/...`）。
- `WORKER_SA_EMAIL`: Spot VM にアタッチするサービスアカウントのメールアドレス。

## デプロイ
ルートディレクトリにある以下のスクリプトを使用してください:

```bash
./scripts/deploy_cf.sh
```

このスクリプトは必要な環境変数を設定し、正しいサービスアカウントを紐付けて関数をデプロイします。
