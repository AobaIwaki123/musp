from enum import Enum


class JobStatus(str, Enum):
    PENDING = "pending"
    FETCHING = "fetching"
    PROCESSING = "processing"
    UPLOADING = "uploading"
    COMPLETED = "completed"
    FAILED = "failed"
