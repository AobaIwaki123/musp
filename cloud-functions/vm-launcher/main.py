import datetime
import logging
import os
from typing import Any, Dict, Optional, Tuple

import functions_framework
from google.cloud import bigquery
from google.cloud import compute_v1

# ロギング設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 環境変数と定数定義
PROJECT_ID = os.environ.get("PROJECT_ID") or os.environ.get("GOOGLE_CLOUD_PROJECT")
ZONE = os.environ.get("ZONE", "asia-northeast1-c")
DATASET_ID = os.environ.get("DATASET_ID", "musp_v3")
BUCKET_NAME = os.environ.get("BUCKET_NAME", "musp-audio-source")  # Default bucket name
TABLE_NAME = "videoID-status"
WORKER_IMAGE = os.environ.get("WORKER_IMAGE", f"gcr.io/{PROJECT_ID}/musp-worker:latest")
WORKER_SA_EMAIL = os.environ.get("WORKER_SA_EMAIL")  # 指定がない場合はCompute EngineのデフォルトSAが使用されます

@functions_framework.http
def launch_worker_vm(request) -> Tuple[Dict[str, Any], int]:
    """
    Spot VMワーカーを起動するHTTP Cloud Function。

    ペイロード:
        {"trigger": "api" | "cron"}

    ロジック:
        1. 既にワーカーVMが実行中か確認する。実行中の場合は終了。
        2. trigger == 'api' の場合: 即座にVMを起動。
        3. trigger == 'cron' の場合:
            - BigQueryで未完了のタスクがあるか確認。
            - タスクがある場合のみVMを起動。
    """
    # 0. リクエストの解析
    request_json = request.get_json(silent=True)
    if not request_json:
        return {"status": "error", "message": "Invalid JSON payload"}, 400
    
    trigger = request_json.get("trigger", "api") 
    logger.info(f"リクエストを受信しました。トリガー: {trigger}")

    # 1. 環境変数の検証
    if not PROJECT_ID or not ZONE:
        logger.error(f"必須環境変数が設定されていません: PROJECT_ID={PROJECT_ID}, ZONE={ZONE}")
        return {"status": "error", "message": "Missing required environment variables"}, 500

    logger.info(f"PROJECT_ID: {PROJECT_ID}, ZONE: {ZONE}, DATASET_ID: {DATASET_ID}, BUCKET_NAME: {BUCKET_NAME}")

    # 2. 実行中のインスタンスを確認（重複起動を防止）
    try:
        if is_worker_running(PROJECT_ID, ZONE):
            logger.info("ワーカーVMは既に実行中です。起動をスキップします。")
            return {"status": "skipped", "reason": "Worker already running"}, 200
    except ValueError as e:
        logger.error(f"In is_worker_running: {e}")
        return {"status": "error", "message": f"Invalid request parameters: {e}"}, 500
    except Exception as e:
        logger.error(f"Unexpected error in is_worker_running: {e}", exc_info=True)
        return {"status": "error", "message": f"Internal server error: {e}"}, 500

    # 2. 起動条件の評価
    should_launch = False
    
    if trigger == "api":
        logger.info("トリガーは 'api' です。即座に起動します。")
        should_launch = True
    elif trigger == "cron":
        logger.info("トリガーは 'cron' です。条件を確認します...")
        bq_client = bigquery.Client(project=PROJECT_ID)
        
        # 未完了タスク数の確認
        incomplete_count = get_incomplete_tasks_count(bq_client, PROJECT_ID, DATASET_ID, TABLE_NAME)
        logger.info(f"未完了タスク数: {incomplete_count}")
        
        if incomplete_count > 0:
            logger.info("未完了タスクが見つかりました。起動します。")
            should_launch = True
        else:
            logger.info("未完了タスクはありません。スキップします。")
            
    else:
         return {"status": "error", "message": f"Unknown trigger: {trigger}"}, 400

    # 3. 条件を満たした場合にVMを起動
    if should_launch:
        try:
            instance_name = launch_vm(
                project_id=PROJECT_ID, 
                zone=ZONE, 
                image=WORKER_IMAGE, 
                sa_email=WORKER_SA_EMAIL,
                dataset_id=DATASET_ID,
                bucket_name=BUCKET_NAME
            )
            logger.info(f"インスタンスを起動しました: {instance_name}")
            return {"status": "launched", "instance": instance_name}, 200
        except Exception as e:
            logger.error(f"VMの起動に失敗しました: {e}")
            return {"status": "error", "message": str(e)}, 500
    
    return {"status": "skipped", "reason": "Conditions not met"}, 200


def is_worker_running(project_id: str, zone: str) -> bool:
    """'musp-worker-' で始まるインスタンスが現在実行中かどうかを確認します。"""
    instance_client = compute_v1.InstancesClient()
    
    # サーバーサイドフィルタリングを使用して、メモリ使用量を削減します。
    # name = "musp-worker-*" (プレフィックス一致) AND status がアクティブな状態
    instance_filter = (
        '(name = "musp-worker-*") AND '
        '(status = "PROVISIONING" OR status = "STAGING" OR status = "RUNNING" OR status = "REPAIRING")'
    )
    
    request = compute_v1.ListInstancesRequest(
        project=project_id, 
        zone=zone,
        filter=instance_filter
    )
    
    # フィルタリングされた結果が1つでもあればTrueを返す
    for _ in instance_client.list(request=request):
        return True
             
    return False

def get_incomplete_tasks_count(client: bigquery.Client, project_id: str, dataset_id: str, table_name: str) -> int:
    """BigQueryから未完了タスク（status != 'COMPLETED'）の数を取得します。"""
    query = f"""
        SELECT COUNT(*) as count
        FROM `{project_id}.{dataset_id}.{table_name}`
        WHERE status != 'COMPLETED'
    """
    job = client.query(query)
    result = job.result()
    for row in result:
        return row.count
    return 0

def launch_vm(project_id: str, zone: str, image: str, sa_email: Optional[str], dataset_id: str, bucket_name: str) -> str:
    """Spot VMを起動します。"""
    instance_client = compute_v1.InstancesClient()
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    instance_name = f"musp-worker-{timestamp}"
    
    machine_type = f"zones/{zone}/machineTypes/n1-standard-4"
    accelerator_type = f"zones/{zone}/acceleratorTypes/nvidia-tesla-t4"
    
    # コンテナマニフェスト - GPU 用の環境変数とデバイスマウントを追加
    container_manifest = f"""
spec:
  containers:
    - image: {image}
      stdin: false
      tty: false
      restartPolicy: Always
      env:
        - name: GOOGLE_CLOUD_PROJECT
          value: {project_id}
        - name: DATASET_ID
          value: {dataset_id}
        - name: BUCKET_NAME
          value: {bucket_name}
        - name: MAX_WORKERS
          value: "2"
        - name: LD_LIBRARY_PATH
          value: /var/lib/nvidia/lib64
        - name: PATH
          value: /var/lib/nvidia/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
      securityContext:
        privileged: true
      volumeMounts:
        - name: nvidia-install-dir-host
          mountPath: /var/lib/nvidia
        - name: nvidia-dev0
          mountPath: /dev/nvidia0
        - name: nvidia-dev-ctl
          mountPath: /dev/nvidiactl
        - name: nvidia-dev-uvm
          mountPath: /dev/nvidia-uvm
        - name: nvidia-dev-uvm-tools
          mountPath: /dev/nvidia-uvm-tools
  volumes:
    - name: nvidia-install-dir-host
      hostPath:
        path: /var/lib/nvidia
    - name: nvidia-dev0
      hostPath:
        path: /dev/nvidia0
    - name: nvidia-dev-ctl
      hostPath:
        path: /dev/nvidiactl
    - name: nvidia-dev-uvm
      hostPath:
        path: /dev/nvidia-uvm
    - name: nvidia-dev-uvm-tools
      hostPath:
        path: /dev/nvidia-uvm-tools
"""

    # startup-script: GPU ドライバインストール完了を待ってからコンテナを起動
    startup_script = """#!/bin/bash
set -e

echo "Installing GPU drivers..."
cos-extensions install gpu

# ドライバのインストール完了を待機
echo "Waiting for nvidia-smi..."
for i in $(seq 1 60); do
    if /var/lib/nvidia/bin/nvidia-smi > /dev/null 2>&1; then
        echo "GPU driver ready!"
        /var/lib/nvidia/bin/nvidia-smi
        break
    fi
    echo "Waiting... ($i/60)"
    sleep 5
done

# デバイスファイルの存在確認
if [ ! -e /dev/nvidia0 ]; then
    echo "ERROR: /dev/nvidia0 not found"
    exit 1
fi

echo "GPU setup complete"
"""

    config = {
        "name": instance_name,
        "machine_type": machine_type,
        "scheduling": {
            "provisioning_model": "SPOT", 
            "on_host_maintenance": "TERMINATE",
            "automatic_restart": False
        },
        "guest_accelerators": [{
            "accelerator_type": accelerator_type,
            "accelerator_count": 1
        }],
        "disks": [{
            "boot": True,
            "auto_delete": True,
            "initialize_params": {
                "source_image": "projects/cos-cloud/global/images/family/cos-stable",
                "disk_size_gb": 50
            }
        }],
        "network_interfaces": [{
            "network": "global/networks/default",
            "access_configs": [{"type": "ONE_TO_ONE_NAT", "name": "External NAT"}]
        }],
        "metadata": {
            "items": [
                {
                    "key": "gce-container-declaration",
                    "value": container_manifest
                },
                {
                    "key": "google-logging-enabled",
                    "value": "true"
                },
                {
                    "key": "startup-script",
                    "value": startup_script
                },
                {
                    "key": "install-nvidia-driver",
                    "value": "true"
                }
            ]
        },
        "service_accounts": [{
            "email": sa_email if sa_email else "default",
            "scopes": ["https://www.googleapis.com/auth/cloud-platform"]
        }]
    }

    operation = instance_client.insert(
        project=project_id,
        zone=zone,
        instance_resource=config
    )
    
    operation.result()
    return instance_name

