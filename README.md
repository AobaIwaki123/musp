# MuSP
音楽の音源とボーカルを分離するWebアプリ

# 概要

1. YouTubeリンクを取得
2. [youtube-dl](https://github.com/ytdl-org/youtube-dl)で音源をダウンロード
3. [Demucs](https://github.com/facebookresearch/demucs)で音源とボーカルに分離
4. 分離した音源を再生

# 使用技術

- Python
  - youtube-dl: YouTubeリンクから音源をダウンロード
  - Demucs: 音源とボーカルの分離
  - FastAPI: APIサーバー
- TypeScript
  - React: フロントエンド
- OpenAPI: API仕様書

# OpenAPI YAMLからコードを生成するコマンド

```sh
$ fastapi-codegen --input openapi.yaml --output api --output-model-type pydantic_v2.BaseModel --model-file models/generated_model -p 3.11
```

## 注意！

`from models.generated_model import Job, JobsPostRequest, JobsPostResponse, Track`はなぜか、`from .models import ...`で出力されるため修正が必要。
