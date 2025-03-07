from celery import chain
from openapi_server.tasks.download_source import download_audio
from openapi_server.tasks.separate_source import separate_audio
from openapi_server.tasks.upload_source import upload_to_cloud


def process_audio(youtube_url: str):
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""
    workflow = chain(
        download_audio.s(youtube_url),
        separate_audio.s(None),
        upload_to_cloud.s(None),
    )
    result = workflow.apply_async()
    return result.id  # ジョブIDを返す
