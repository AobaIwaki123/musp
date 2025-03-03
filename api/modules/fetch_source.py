import subprocess

from models.job import Job


def fetch_source(job: Job) -> bool:
    url = job.youtube_url
    job_id = job.job_id
    print(f"Fetching source for job {job_id}")
    tmp_path = f"tmp/{job_id}/source.mp4"
    _ = subprocess.run(
        ["yt-dlp", url, "-o", tmp_path],
        capture_output=True,
        text=True,
    )
    print(f"Source fetched for job {job_id}")
    return True
