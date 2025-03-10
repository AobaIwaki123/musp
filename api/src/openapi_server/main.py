# coding: utf-8

"""
MuSP API

MuSPは、YouTubeリンクから音源をダウンロードし、Demucsで音源とボーカルを分離するWebアプリです。 本API仕様書は、ジョブの作成、状態確認、分離済み音源の取得を提供します。

The version of the OpenAPI document: 1.0.0
Generated by OpenAPI Generator (https://openapi-generator.tech)

Do not edit the class manually.
"""  # noqa: E501

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openapi_server.apis.check_job_api import (
    router as CheckJobApiRouter,
)
from openapi_server.apis.create_job_api import (
    router as CreateJobApiRouter,
)
from openapi_server.apis.get_url_api import router as GetURLApiRouter
from openapi_server.apis.user_api import router as UserApiRouter

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app = FastAPI(
    title="MuSP API",
    description="MuSPは、YouTubeリンクから音源をダウンロードし、Demucsで音源とボーカルを分離するWebアプリです。 本API仕様書は、ジョブの作成、状態確認、分離済み音源の取得を提供します。 ",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=origins,  # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(CheckJobApiRouter)
app.include_router(CreateJobApiRouter)
app.include_router(GetURLApiRouter)
app.include_router(UserApiRouter)
