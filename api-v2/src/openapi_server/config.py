import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_ID: str = os.getenv("GOOGLE_CLOUD_PROJECT", "test-project")
    DATASET_ID: str = os.getenv("DATASET_ID", "musp")
    BUCKET_NAME: str = os.getenv("BUCKET_NAME", "musp-bucket")
    WORKER_LAUNCHER_URL: str = os.getenv("WORKER_LAUNCHER_URL", "http://localhost:8080")
    
    class Config:
        env_file = ".env"

settings = Settings()
