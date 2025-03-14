from celery, group, chord import chain
from openapi_server.process_source.tasks import (
    fetch_source,
    post_run,
    separate_source,
    upload_source,
    update_video_status,
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
        group(
            update_video_status.s(data, "processing"),
            fetch_source.s(data)
        ) | separate_source.s(),
        upload_source.s(),
        chord(
            [
                post_run.s(),
                update_video_status.s(data, "completed")
            ],
            body=None
        )
    )

    # 非同期実行
    result = task_chain.apply_async()

    return result.id  # CeleryタスクのIDを返す
