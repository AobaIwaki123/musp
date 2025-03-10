import re


def normalize_youtube_url(url):
    pattern = r"^(?:https?://)?(?:www\.)?(?:youtube\.com/(?:watch\?.*v=|embed/|v/)|youtu\.be/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)
    if match:
        video_id = match.group(1)
        return f"https://www.youtube.com/watch?v={video_id}"
    return None  # マッチしない場合は None を返す
