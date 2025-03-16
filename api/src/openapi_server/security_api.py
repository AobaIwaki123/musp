# coding: utf-8

from typing import Optional

from fastapi import (  # noqa: F401
    Depends,
    HTTPException,
    Security,
    status,
)
from fastapi.openapi.models import (  # noqa: F401
    OAuthFlowImplicit,
    OAuthFlows,
)
from fastapi.security import (  # noqa: F401
    HTTPAuthorizationCredentials,
    HTTPBasic,
    HTTPBasicCredentials,
    HTTPBearer,
    OAuth2,
    OAuth2AuthorizationCodeBearer,
    OAuth2PasswordBearer,
    SecurityScopes,
)
from fastapi.security.api_key import (  # noqa: F401
    APIKeyCookie,
    APIKeyHeader,
    APIKeyQuery,
)
from openapi_server.models.extra_models import TokenModel

# APIキーのヘッダー名を設定
API_KEY_NAME = "X-API-KEY"
VALID_API_KEYS = {  # 実際の運用ではデータベースなどで管理する
    "secret-api-key-123": "user1",
    "another-secret-key": "user2",
}

api_key_header = APIKeyHeader(
    name=API_KEY_NAME, auto_error=False
)


def get_token_ApiKeyAuth(
    token_api_key_header: Optional[str] = Security(
        api_key_header
    ),
) -> TokenModel:
    """
    Check and retrieve authentication information from api_key.

    :param token_api_key_header: API key provided by Authorization[X-API-KEY] header
    :return: Information attached to provided api_key or None if api_key is invalid
    """
    if token_api_key_header in VALID_API_KEYS:
        return TokenModel(
            sub=VALID_API_KEYS[token_api_key_header]
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API key",
        headers={"WWW-Authenticate": "API key"},
    )
