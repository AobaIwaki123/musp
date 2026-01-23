"""Task: Separate audio into vocals and instruments using Demucs."""

import logging
import subprocess
from pathlib import Path
from typing import Tuple

logger = logging.getLogger(__name__)


def separate_source(
    video_id: str,
    source_path: str,
    work_dir: str,
) -> Tuple[str, str]:
    """
    Separate audio into vocals and instruments using Demucs.

    Args:
        video_id: The YouTube video ID.
        source_path: Path to the source audio file.
        work_dir: Working directory for output files.

    Returns:
        Tuple of (vocal_path, instrumental_path).

    Raises:
        RuntimeError: If separation fails.
    """
    logger.info(f"Separating source for video: {video_id}")

    video_dir = Path(work_dir) / video_id
    out_dir = video_dir / "separated"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Run Demucs for vocal separation
    cmd = [
        "demucs",
        "--two-stems", "vocals",
        "--out", str(out_dir),
        source_path,
    ]

    logger.info(f"Running command: {' '.join(cmd)}")

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        error_msg = f"Demucs failed: {result.stderr}"
        logger.error(error_msg)
        raise RuntimeError(error_msg)

    # Find output files
    # Demucs outputs to: out_dir/htdemucs/{source_name}/vocals.wav and no_vocals.wav
    source_name = Path(source_path).stem
    demucs_output = out_dir / "htdemucs" / source_name

    vocal_path = demucs_output / "vocals.wav"
    inst_path = demucs_output / "no_vocals.wav"

    if not vocal_path.exists():
        raise RuntimeError(f"Vocal file not found: {vocal_path}")

    if not inst_path.exists():
        raise RuntimeError(f"Instrumental file not found: {inst_path}")

    logger.info(f"Separation complete: vocals={vocal_path}, inst={inst_path}")
    return str(vocal_path), str(inst_path)
