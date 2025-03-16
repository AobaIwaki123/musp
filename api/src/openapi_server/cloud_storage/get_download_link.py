import datetime
import logging
import os

from google.cloud import storage
from google.oauth2 import service_account

# ロギング設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

CREDENTIAL_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)


def get_download_link(
    bucket_name: str,
    blob_name: str,
    expiration_minutes: int = 60,
) -> str:
    """GCSのオブジェクトに対する署名付きURL（ダウンロード用）を生成する。

    Args:
        bucket_name (str): GCS のバケット名。
        blob_name (str): 取得対象のオブジェクト名（パス）。
        expiration_minutes (int): 署名付きURLの有効期限（分）。

    Returns:
        str: 生成された署名付きURL（存在しない場合は None）。
    """
    logging.info(
        f"Generating signed URL for {bucket_name}/{blob_name} with expiration {expiration_minutes} minutes."
    )

    if CREDENTIAL_PATH and os.path.exists(CREDENTIAL_PATH):
        logging.info(
            "Using service account credentials from file."
        )
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIAL_PATH
        )
        storage_client = storage.Client(
            credentials=credentials
        )
    else:
        logging.info(
            "Using default application credentials."
        )
        storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    # ファイルが存在するか確認
    if not blob.exists():
        logging.warning(
            f"Blob {blob_name} does not exist in bucket {bucket_name}."
        )
        return "None"

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(
            minutes=expiration_minutes
        ),
        method="GET",
    )

    logging.info(
        f"Signed URL generated for {blob_name}: {url}"
    )
    return url
