import shutil

from celery_server.celery_app import app
from openapi_server.utils.normalize_youtube_url import (
    get_youtube_video_id,
)


@app.task(bind=True)
def post_run(self, data: dict) -> dict:
    youtube_url = data["youtube_url"]
    video_id = get_youtube_video_id(youtube_url)

    path = f"tmp/{video_id}"
    try:
        shutil.rmtree(path)
        print(f"Deleted directory: {path}")
    except FileNotFoundError:
        print(f"Directory not found: {path}")
    except PermissionError:
        print(f"Permission denied: {path}")
    except Exception as e:
        print(f"Error deleting directory {path}: {e}")

    return data
