import sys
from pathlib import Path

# Add the CLI project root to Python path
cli_path = Path(__file__).parent.parent.parent.parent / "oneShotCodeGen" / "src"
sys.path.append(str(cli_path))

from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import projects, settings
from app.websocket import websocket_manager
from app.dependencies import get_current_user
from .database import supabase
app = FastAPI(title="OneShotCodeGen API")

# Update CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    projects.router,
    prefix="/api",
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    settings.router,
    prefix="/api",
    tags=["settings"],
    dependencies=[Depends(get_current_user)]
)

# WebSocket endpoint with authentication
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str,project_id: str):
    if not token:
        await websocket.close(code=4001)
        return
        
    try:
        # Verify token
        user = supabase.auth.get_user(token)
        if not user:
            await websocket.close(code=4001)
            return
            
        await websocket_manager.connect(websocket, project_id)
        try:
            while True:
                data = await websocket.receive_text()
                print(f"Received message: project_id: {project_id} and data: {data}")
                # Handle incoming WebSocket messages
        except Exception as e:
            print(f"WebSocket error: {e}")
        finally:
            await websocket_manager.disconnect(websocket)
    except Exception as e:
        await websocket.close(code=4001) 