import os

from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(
    name="X-API-KEY"
)  # リクエストヘッダーからAPIキーを取得する際に使用(APIキーのヘッダーはapi_access_id)


def check_key(api_key_header: str = Security(api_key_header)) -> str:
    """
    APIへのアクセス権を検証
    APIのエンドポイントが呼ばれた際に実行
    Args:
        api_key_header (str): APIのエンドポイントが呼ばれた際にリクエストヘッダーから取得されるAPIアクセスキー

    Returns:
        api_key_header (str): APIアクセスキー

    Raises:
        HTTP_401_UNAUTHORIZED: APIアクセス権がない.アクセスキーに誤りがある.

    """
    # 環境変数からAPIアクセスキーを取得
    api_access_key = os.getenv("API_KEY")

    # リクエスト内のAPIアクセスキーを環境変数に設定されたAPIアクセスキーと照合,一意は許可,不一致は拒否
    if api_key_header == api_access_key:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )
