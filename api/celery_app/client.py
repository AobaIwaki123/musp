from time import sleep

from job_task import job_task

# タスクを非同期実行（youtube_urlには適切なURLを指定）
result = job_task.delay("https://www.youtube.com/watch?v=example")
print(result.id)
# タスクが完了するまで、1秒ごとに状態と情報を確認
while not result.ready():
    print("State:", result.state)
    print("Job Info:", result.info)
    sleep(1)

# 最終結果の取得
job = result.get(timeout=10)
print("Final Job:", job)
