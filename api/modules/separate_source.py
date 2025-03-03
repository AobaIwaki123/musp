import subprocess

from models.job import Job


def separate_source(job: Job) -> bool:
    job_id = job.job_id
    source_path = f"tmp/{job_id}/source.webm"
    tmp_path = f"tmp/{job_id}/separated/"

    subprocess.run(
        ["demucs", "--two-stems", "vocals", source_path, "-o", tmp_path],
        capture_output=True,
        text=True,
    )

    return True
