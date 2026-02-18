"""YouTube utilities for the worker."""

import re
from typing import Optional
from urllib.parse import parse_qs, urlparse


def construct_youtube_url(video_id: str) -> str:
    """
    Construct a YouTube URL from a video ID.

    Args:
        video_id: The YouTube video ID.

    Returns:
        The full YouTube URL.
    """
    return f"https://www.youtube.com/watch?v={video_id}"
