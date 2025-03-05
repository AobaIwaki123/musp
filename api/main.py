from __future__ import annotations

# Utils
# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routes
from routers.jobs import router as jobs_router

# Auth

app = FastAPI(
    title="MuSP API",
    version="1.0.0",
    description="MuSPは、YouTubeリンクから音源をダウンロードし、Demucsで音源とボーカルを分離するWebアプリです。\n本API仕様書は、ジョブの作成、状態確認、分離済み音源の取得を提供します。\n",
    servers=[{"url": "http://localhost:8000"}],
)

origins = [
    "http://localhost:8000",
    "http://100.92.146.108:8000",
    "ws://100.92.146.108:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root API for health check
@app.get(
    "/",
)
def read_root():
    return "MuSP API is running!"


# Add Routers
app.include_router(jobs_router, prefix="/api/v1")
