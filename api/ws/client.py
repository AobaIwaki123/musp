import asyncio
import websockets
import json

API_KEY = "my-secret-key"
JOB_ID = "1"
URL = f"ws://localhost:8000/ws/jobs/{JOB_ID}"


async def listen():
    async with websockets.connect(
        URL, additional_headers={"X-API-KEY": API_KEY}
    ) as websocket:
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            print(
                f"Job ID: {data['job_id']}, Status: {data['status']}"
            )
            if data["status"] == "completed":
                break


asyncio.run(listen())
