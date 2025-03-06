import subprocess

from models.job import Job


def fetch_source(job: Job) -> bool:
    url = job.youtube_url
    job_id = job.job_id
    tmp_path = f"tmp/{job_id}/source"
    
    print("fetching source")
    subprocess.run(
        ["yt-dlp", url, "-o", tmp_path],
        capture_output=True,
        text=True,
    )
    print("fetched source")

    return True
