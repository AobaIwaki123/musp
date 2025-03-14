from celery import chain
from openapi_server.process_source.tasks import (
    fetch_source,
    post_run,
    separate_source,
    upload_source,
)
from openapi_server.utils.normalize_youtube_url import (
    normalize_youtube_url,
)


def process_source(data: dict) -> str:
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""

    normalized_url = normalize_youtube_url(
        data["youtube_url"]
    )
    if not normalized_url:
        raise ValueError("Invalid YouTube URL")

    data["youtube_url"] = normalized_url

    # Celeryの処理チェーンを作成
    task_chain = chain(
        fetch_source.s(data),
        separate_source.s(),
        upload_source.s(),
        post_run.s(),
    )

    # 非同期実行
    result = task_chain.apply_async()

    return result.id  # CeleryタスクのIDを返す
