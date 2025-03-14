import datetime
import os

from google.cloud import storage
from google.oauth2 import service_account

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)


def get_download_link(
    bucket_name, blob_name, expiration_minutes=60
):
    """GCSのオブジェクトに対する署名付きURL（ダウンロード用）を生成"""

    if CREDENTIAL_PATH and os.path.exists(CREDENTIAL_PATH):
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIAL_PATH
        )
        storage_client = storage.Client(
            credentials=credentials
        )
    else:
        storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    # ファイルが存在するか確認
    if not blob.exists():
        return None  # 存在しない場合は None を返す

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(
            minutes=expiration_minutes
        ),
        method="GET",
    )

    return url
