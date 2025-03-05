from job_task import sample_task

# 1. タスクの送信
result = sample_task.delay(10, 20)
print("Task ID:", result.id)

# 2. タスク状態の確認（任意）
print("Current state:", result.state)
print(
    "Intermediate info:", result.info
)  # update_stateで設定したメタ情報が表示される場合がある

# 3. タスク完了を待機して結果を取得
try:
    final_result = result.get(timeout=10)
    print("Ready:", result.ready())
    print("Final State:", result.state)
    print("Final result:", final_result)
except Exception as e:
    print("タスク実行中にエラーが発生:", e)
