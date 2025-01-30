from fastapi import WebSocket
from typing import Dict

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}  # Map project_id to WebSocket

    async def connect(self, websocket: WebSocket, project_id: str):
        await websocket.accept()
        self.active_connections[project_id] = websocket
        print(f"WebSocket connected for project {project_id}")
        print(f"Active connections: {self.active_connections.keys()}")

    async def disconnect(self, project_id: str):
        if project_id in self.active_connections:
            del self.active_connections[project_id]
            print(f"WebSocket disconnected for project {project_id}")

    async def broadcast_to_project(self, project_id: str, message: dict):
        print(f"Broadcasting to project {project_id}")
        print(f"Active connections: {self.active_connections}")
        print(f"Active connections keys: {self.active_connections.keys()}")
        if project_id in self.active_connections:
            try:
                websocket = self.active_connections[project_id]
                await websocket.send_json(message)
                print(f"Message sent to project {project_id}: {message}")
            except Exception as e:
                print(f"Error sending message to project {project_id}: {str(e)}")
                await self.disconnect(project_id)
        else:
            print(f"No active WebSocket connection for project {project_id}")


# Create a shared instance
websocket_manager = WebSocketManager()
