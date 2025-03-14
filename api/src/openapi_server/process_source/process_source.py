from celery import chain
from openapi_server.models.custom.task_status import (
    TaskStatus,
)
from openapi_server.process_source.tasks.fetch_source import (
    fetch_source,
)
from openapi_server.process_source.tasks.separate_source import (
    separate_source,
)
from openapi_server.process_source.tasks.upload_source import (
    upload_source,
)
from openapi_server.utils.normalize_youtube_url import (
    normalize_youtube_url,
)


def process_source(self, data: dict) -> str:
    """非同期処理チェーンを作成し、FastAPI から実行できるようにする"""
    if not normalize_youtube_url(data["youtube_url"]):
        raise ValueError("Invalid YouTube URL")

    data["youtube_url"] = normalize_youtube_url(
        data["youtube_url"]
    )

    self.update_state(
        state=TaskStatus.STARTED.value,
        meta={"step": "Processing audio"},
    )

    parallel_tasks = (
        chain(
            fetch_source.s(data),
            separate_source.s(),
            upload_source.s(),
        ),
    )

    parallel_tasks.apply_async()

    self.update_state(
        state=TaskStatus.SUCCESS.value,
        meta={"step": "Processing completed"},
    )
