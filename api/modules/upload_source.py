import subprocess

from models.job import Job


def upload_source(job: Job) -> bool:
    job_id = job.job_id
    source_path = f"tmp/{job_id}/source.mp4"

    subprocess.run(
        ["yt-dlp", url, "-o", tmp_path],
        capture_output=True,
        text=True,
    )

    return True
