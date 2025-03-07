from celery import chain
from openapi_server.tasks.fetch_source import fetch_source
from openapi_server.tasks.separate_source import separate_source
from openapi_server.tasks.upload_source import upload_source


def process_audio(youtube_url: str):
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""
    workflow = chain(
        fetch_source.s(youtube_url),
        separate_source.s(),
        upload_source.s(),
    )
    result = workflow.apply_async()
    return result.id  # ジョブIDを返す
