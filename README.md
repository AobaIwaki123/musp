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
