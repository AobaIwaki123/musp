from enum import Enum


class JobStatus(str, Enum):
    PENDING = "PENDING"
    FETCHING = "FETCHING"
    PROCESSING = "PROCESSING"
    UPLOADING = "UPLOADING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
