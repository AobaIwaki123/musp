# MuSP Worker

GCP Spot VM 上で動作する、YouTube 音源処理ワーカーです。
BigQuery から未処理の動画タスクを取得し、音源のダウンロード、ボーカル抽出 (分離)、GCS へのアップロードを行います。

## 概要

このワーカーは、コスト効率の高い Spot VM インスタンス上で実行されることを想定して設計されています。
処理が完了するか、タスクがなくなると、自動的にインスタンスを削除してコストを抑えます。

主な処理フロー:
1.  **Fetch**: BigQuery から未処理 (`status != COMPLETED`) の動画 ID リストを取得。
2.  **Process**: `concurrent.futures` を使用して、複数の動画を並列処理 (デフォルト: 2並列)。
    *   **Download**: YouTube から音源をダウンロード (`yt-dlp` 使用)。
    *   **Separate**: Demucs を使用して、ボーカルとインストゥルメンタルに分離。
    *   **Upload**: 分離された音源を Google Cloud Storage (GCS) にアップロード。
    *   **Update**: BigQuery のステータスを更新 (署名付き URL を保存)。
3.  **Cleanup**: ローカルの一時ファイルを削除。
4.  **Terminate**: 全ての処理が完了後、自身 (VM) を削除。

## ディレクトリ構成

```
worker/
├── main.py              # エントリーポイント。並列処理のオーケストレーションを行う。
├── Dockerfile           # 実行環境定義 (CUDA, Python, FFmpeg)。
├── requirements.txt     # Python 依存ライブラリ。
├── tasks/               # 各処理ステップの実装。
│   ├── fetch_source.py    # YouTube ダウンロード
│   ├── separate_source.py # Demucs 音源分離
│   ├── upload_source.py   # GCS アップロード
│   ├── update_status.py   # BigQuery ステータス更新
│   └── cleanup.py         # 一時ファイル削除・VM 削除
└── utils/               # ユーティリティ。
    ├── bigquery.py      # BigQuery クライアント
    ├── gcs.py           # GCS クライアント
    ├── youtube.py       # YouTube URL 処理
    └── metadata.py      # GCP メタデータ取得
```

## 必要要件

*   **Docker**: コンテナ化されて動作します。
*   **NVIDIA GPU**: 音源分離 (Demucs) の高速化に CUDA を使用するため、GPU インスタンス推奨 (例: T4)。
*   **GCP Credentials**:
    *   BigQuery への読み書き権限
    *   GCS バケットへの書き込み権限
    *   Compute Engine への削除権限 (自己削除用)

## 環境変数

| 変数名 | デフォルト値 | 説明 |
| :--- | :--- | :--- |
| `MAX_WORKERS` | `2` | 並列処理するプロセス数。GPU メモリ容量に応じて調整してください。 |
| `PROJECT_ID` | 自動取得 | GCP プロジェクト ID。 |
| `REGION` | 自動取得 | GCP リージョン。 |

## 開発・実行

### ローカルビルド

```bash
docker build -t musp-worker .
```

### ローカル実行 (テスト)

GCP 認証情報が必要です。ローカルで実行する場合、サービスアカウントキーをマウントするなどの対応が必要です。

```bash
docker run --rm -it \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json \
  -v /path/to/credentials.json:/app/credentials.json \
  musp-worker
```

**注意**: ローカル実行時は `cleanup.py` 内の VM 削除ロジックが誤って動作しないように注意してください (通常はメタデータサーバーへのアクセス失敗等でスキップされますが、コード上でガードされています)。

## 技術スタック

*   **Python 3.10+**
*   **Demucs**: Facebook Research による高品質な音源分離ライブラリ。
*   **yt-dlp**: YouTube 音源ダウンロード。
*   **Google Cloud Client Libraries**: BigQuery, Storage, Compute Engine 制御。
