import os

from fastapi import Header, HTTPException

# APIキー認証
API_KEY = os.getenv(
    "API_KEY",
)


def get_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
