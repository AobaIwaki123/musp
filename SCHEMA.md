# BigQuery Schema Definition

## 概要

MuSPで使用するBigQueryのスキーマ定義。プロジェクトB（MuSPメイン）に配置。

```
Dataset: musp_v3
Project: {PROJECT_B_ID}
```

---

## テーブル一覧

| テーブル名 | 用途 | 主キー |
|-----------|------|--------|
| `googleID-userID` | Googleアカウント → ユーザーID マッピング | googleID |
| `userID-videoID` | ユーザー → 動画 紐付け | (userID, videoID) |
| `videoID-status` | 動画処理ステータス管理 | videoID |
| `videoID-vocalWavURL` | ボーカル音声URL | videoID |
| `videoID-instWavURL` | インスト音声URL | videoID |

---

## テーブル詳細

### 1. `googleID-userID`

Googleアカウント（Firebase Auth）とアプリ内ユーザーIDのマッピング。

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `googleID` | STRING | NOT NULL | Google アカウント ID (Firebase uid) |
| `userID` | STRING | NOT NULL | アプリ内ユーザー ID (UUID v4) |
| `createdAt` | TIMESTAMP | NOT NULL | 作成日時 |
| `updatedAt` | TIMESTAMP | NOT NULL | 更新日時 |

```sql
CREATE TABLE `{PROJECT_B_ID}.musp_v3.googleID-userID` (
  googleID STRING NOT NULL,
  userID STRING NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);
```

**インデックス推奨**: `googleID` でのルックアップが頻繁

---

### 2. `userID-videoID`

ユーザーと動画の紐付け（多対多）。

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `userID` | STRING | NOT NULL | ユーザー ID |
| `videoID` | STRING | NOT NULL | YouTube 動画 ID |
| `createdAt` | TIMESTAMP | NOT NULL | 登録日時 |
| `updatedAt` | TIMESTAMP | NOT NULL | 更新日時 |

```sql
CREATE TABLE `{PROJECT_B_ID}.musp_v3.userID-videoID` (
  userID STRING NOT NULL,
  videoID STRING NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);
```

**複合キー**: `(userID, videoID)` で重複チェック

---

### 3. `videoID-status`

動画処理のステータス管理。**新アーキテクチャで拡張**。

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `videoID` | STRING | NOT NULL | YouTube 動画 ID |
| `status` | STRING | NOT NULL | 処理ステータス |
| `youtubeURL` | STRING | NULLABLE | YouTube URL（新規） |
| `vmInstanceName` | STRING | NULLABLE | Spot VM インスタンス名（新規） |
| `errorMessage` | STRING | NULLABLE | エラーメッセージ（新規） |
| `createdAt` | TIMESTAMP | NOT NULL | タスク作成日時 |
| `queuedAt` | TIMESTAMP | NULLABLE | VM起動キュー投入日時（新規） |
| `startedAt` | TIMESTAMP | NULLABLE | 処理開始日時（新規） |
| `completedAt` | TIMESTAMP | NULLABLE | 処理完了日時（新規） |
| `updatedAt` | TIMESTAMP | NOT NULL | 最終更新日時 |

#### ステータス遷移

```
PENDING → QUEUED → PROCESSING → COMPLETED
                            ↘ FAILED
```

| ステータス | 説明 |
|-----------|------|
| `PENDING` | API経由で登録済み、VM未起動 |
| `QUEUED` | CronJobがCloud Functionsを呼び出し済み |
| `PROCESSING` | Spot VMで処理中 |
| `COMPLETED` | 処理完了、WAV URLが利用可能 |
| `FAILED` | 処理失敗 |

```sql
CREATE TABLE `{PROJECT_B_ID}.musp_v3.videoID-status` (
  videoID STRING NOT NULL,
  status STRING NOT NULL,
  youtubeURL STRING,
  vmInstanceName STRING,
  errorMessage STRING,
  createdAt TIMESTAMP NOT NULL,
  queuedAt TIMESTAMP,
  startedAt TIMESTAMP,
  completedAt TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL
);
```

---

### 4. `videoID-vocalWavURL`

ボーカル分離音声のGCS URL。

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `videoID` | STRING | NOT NULL | YouTube 動画 ID |
| `wavURL` | STRING | NOT NULL | GCS 署名付き URL |
| `createdAt` | TIMESTAMP | NULLABLE | 作成日時（新規） |
| `updatedAt` | TIMESTAMP | NULLABLE | URL更新日時（新規） |

```sql
CREATE TABLE `{PROJECT_B_ID}.musp_v3.videoID-vocalWavURL` (
  videoID STRING NOT NULL,
  wavURL STRING NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**備考**: `wavURL` は署名付きURLのため、定期的に更新が必要（CronJobで60分ごと）

---

### 5. `videoID-instWavURL`

インストゥルメンタル分離音声のGCS URL。

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `videoID` | STRING | NOT NULL | YouTube 動画 ID |
| `wavURL` | STRING | NOT NULL | GCS 署名付き URL |
| `createdAt` | TIMESTAMP | NULLABLE | 作成日時（新規） |
| `updatedAt` | TIMESTAMP | NULLABLE | URL更新日時（新規） |

```sql
CREATE TABLE `{PROJECT_B_ID}.musp_v3.videoID-instWavURL` (
  videoID STRING NOT NULL,
  wavURL STRING NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## ER図

```
┌─────────────────────┐
│  googleID-userID    │
├─────────────────────┤
│ PK googleID         │
│    userID           │───────┐
│    createdAt        │       │
│    updatedAt        │       │
└─────────────────────┘       │
                              │ 1:N
                              ▼
┌─────────────────────┐    ┌─────────────────────┐
│  userID-videoID     │    │                     │
├─────────────────────┤    │                     │
│ FK userID           │◄───┘                     │
│ FK videoID          │───────────┬─────────────┐│
│    createdAt        │           │             ││
│    updatedAt        │           │             ││
└─────────────────────┘           │             ││
                                  │ 1:1         ││
                                  ▼             ││
┌─────────────────────┐    ┌─────────────────────┐
│  videoID-status     │    │ videoID-vocalWavURL │
├─────────────────────┤    ├─────────────────────┤
│ PK videoID          │◄───│ PK videoID          │
│    status           │    │    wavURL           │
│    youtubeURL       │    │    createdAt        │
│    vmInstanceName   │    │    updatedAt        │
│    errorMessage     │    └─────────────────────┘
│    createdAt        │           │
│    queuedAt         │           │ 1:1
│    startedAt        │           ▼
│    completedAt      │    ┌─────────────────────┐
│    updatedAt        │    │ videoID-instWavURL  │
└─────────────────────┘    ├─────────────────────┤
                           │ PK videoID          │
                           │    wavURL           │
                           │    createdAt        │
                           │    updatedAt        │
                           └─────────────────────┘
```

---

## マイグレーション

### 既存 → 新スキーマへの変更

```sql
-- videoID-status テーブルへのカラム追加
ALTER TABLE `{PROJECT_B_ID}.musp_v3.videoID-status`
ADD COLUMN IF NOT EXISTS youtubeURL STRING,
ADD COLUMN IF NOT EXISTS vmInstanceName STRING,
ADD COLUMN IF NOT EXISTS errorMessage STRING,
ADD COLUMN IF NOT EXISTS queuedAt TIMESTAMP,
ADD COLUMN IF NOT EXISTS startedAt TIMESTAMP,
ADD COLUMN IF NOT EXISTS completedAt TIMESTAMP;

-- videoID-vocalWavURL テーブルへのカラム追加
ALTER TABLE `{PROJECT_B_ID}.musp_v3.videoID-vocalWavURL`
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP;

-- videoID-instWavURL テーブルへのカラム追加
ALTER TABLE `{PROJECT_B_ID}.musp_v3.videoID-instWavURL`
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP;
```

---

## クエリ例

### PENDINGタスクの取得（Task Launcher用）

```sql
SELECT videoID, youtubeURL, createdAt
FROM `{PROJECT_B_ID}.musp_v3.videoID-status`
WHERE status = 'PENDING'
ORDER BY createdAt ASC
LIMIT 10;
```

### ユーザーの動画一覧取得（API用）

```sql
SELECT
  uv.videoID,
  vs.status,
  vw.wavURL AS vocalWavURL,
  iw.wavURL AS instWavURL
FROM `{PROJECT_B_ID}.musp_v3.userID-videoID` AS uv
LEFT JOIN `{PROJECT_B_ID}.musp_v3.videoID-status` AS vs
  ON uv.videoID = vs.videoID
LEFT JOIN `{PROJECT_B_ID}.musp_v3.videoID-vocalWavURL` AS vw
  ON uv.videoID = vw.videoID
LEFT JOIN `{PROJECT_B_ID}.musp_v3.videoID-instWavURL` AS iw
  ON uv.videoID = iw.videoID
WHERE uv.userID = @user_id;
```

### ステータス更新（Worker用）

```sql
UPDATE `{PROJECT_B_ID}.musp_v3.videoID-status`
SET
  status = @status,
  startedAt = CASE WHEN @status = 'PROCESSING' THEN CURRENT_TIMESTAMP() ELSE startedAt END,
  completedAt = CASE WHEN @status IN ('COMPLETED', 'FAILED') THEN CURRENT_TIMESTAMP() ELSE completedAt END,
  errorMessage = @error_message,
  updatedAt = CURRENT_TIMESTAMP()
WHERE videoID = @video_id;
```

### 長時間PROCESSINGの検出（監視用）

```sql
SELECT videoID, vmInstanceName, startedAt
FROM `{PROJECT_B_ID}.musp_v3.videoID-status`
WHERE status = 'PROCESSING'
  AND startedAt < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE);
```

---

## 注意事項

1. **BigQueryの制約**: 主キー制約は強制されない。アプリケーション側で重複チェックが必要
2. **署名付きURL**: `wavURL` は有効期限付き。CronJobで定期更新
3. **パラメータ化クエリ**: SQLインジェクション防止のため、必ず `@param` 形式を使用
4. **コスト**: スキャン量課金。頻繁なクエリには適切なパーティショニング/クラスタリングを検討
