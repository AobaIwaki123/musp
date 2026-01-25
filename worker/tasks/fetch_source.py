"""Task: Fetch source audio from YouTube."""

import logging
import os
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)


def fetch_source(video_id: str, youtube_url: str, work_dir: str) -> str:
    """
    Download audio from YouTube using yt-dlp.

    Args:
        video_id: The YouTube video ID.
        youtube_url: The YouTube URL.
        work_dir: Working directory for temporary files.

    Returns:
        Path to the downloaded source file.

    Raises:
        RuntimeError: If download fails.
    """
    logger.info(f"Fetching source for video: {video_id}")

    # Create work directory
    video_dir = Path(work_dir) / video_id
    video_dir.mkdir(parents=True, exist_ok=True)

    out_path = video_dir / "source.webm"

    # Download using yt-dlp with iOS player client to avoid JS runtime issues
    cmd = [
        "yt-dlp",
        "--extractor-args", "youtube:player_client=ios",  # iOS client doesn't need JS runtime
        "--extract-audio",
        "--audio-format", "best",
        "--output", str(out_path),
        youtube_url,
    ]

    logger.info(f"Running command: {' '.join(cmd)}")

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        error_msg = f"yt-dlp failed: {result.stderr}"
        logger.error(error_msg)
        raise RuntimeError(error_msg)

    # Find the actual output file (yt-dlp may change extension)
    possible_extensions = [".webm", ".m4a", ".mp3", ".opus", ".wav"]
    source_path = None

    for ext in possible_extensions:
        candidate = video_dir / f"source{ext}"
        if candidate.exists():
            source_path = candidate
            break

    # Also check for files without the exact name
    if source_path is None:
        for file in video_dir.iterdir():
            if file.is_file() and file.suffix in possible_extensions:
                source_path = file
                break

    if source_path is None or not source_path.exists():
        raise RuntimeError(f"Downloaded file not found in {video_dir}")

    logger.info(f"Source downloaded: {source_path}")
    return str(source_path)
