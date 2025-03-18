import os
from typing import Optional

from google.cloud import bigquery
from google.oauth2 import service_account
from openapi_server.process_source import (
    process_source,
)

BQ_PROJECT = "zennaihackason"
BQ_DATASET = "musp_v3"
BQ_STATUS_TABLE = "videoID-status"

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)


def get_youtube_url_from_videoid(video_id: str) -> str:
    return f"https://www.youtube.com/watch?v={video_id}"


def create_and_upload_inst_wav_url():
    query_job = [
        "v-WcMQbXbKY",
        "E28gVYFJxxI",
        "WJarqWZG-qI",
        "9P3kxfons2E",
        "Vgwuc0C9UoQ",
        "qK9k2J-ZkGU",
        "vcp7XKBylkM",
        "WrA8OgKj8JY",
        "H77btmwX12Y",
        "Z59HsgPVbWY",
        "I1qSilZNvFs",
        "B2teLF9l4aI",
        "K5HPhoqyO4U",
        "JhEEV5MvwCA",
        "oCb89c0MDVk",
    ]

    datas = [
        {
            "youtube_url": get_youtube_url_from_videoid(
                row
            )
        }
        for row in query_job
    ]

    # Celeryタスクを非同期で実行
    for data in datas:
        process_source.apply_async(args=[data])


if __name__ == "__main__":
    create_and_upload_inst_wav_url()
