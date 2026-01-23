# API リファレンス

## POST /tasks

新規の処理タスクを作成します。

**リクエストボディ**
```json
{
  "user_id": "string (UUID)",
  "youtube_url": "string (YouTube URL)"
}
```

**レスポンス (201 Created)**
```json
{
  "status_code": 201,
  "status_message": "Job created",
  "youtube_id": "video_id_here"
}
```

**レスポンス (200 OK)**
動画がすでにユーザーのライブラリに存在する場合。
```json
{
  "status_code": 200,
  "status_message": "Video already exists",
  "youtube_id": "video_id_here"
}
```

---

## POST /videos/{video_id}/refresh-urls

分離された音源ファイル（ボーカル/インスト）のGCS署名付きURLを生成し、BigQuery (`videoID-vocalWavURL`, `videoID-instWavURL`) を更新します。
URLの有効期限切れを防ぐため、Cron等で定期的、またはオンデマンドで呼び出してください。

**パスパラメータ**
- `video_id`: YouTube 動画 ID

**レスポンス (200 OK)**
```json
{
  "status": "updated",
  "video_id": "video_id_here",
  "vocal_url": "https://storage.googleapis.com/...",
  "inst_url": "https://storage.googleapis.com/..."
}
```

**エラー**
- `404 Not Found`: GCSにファイルが存在しない場合。
