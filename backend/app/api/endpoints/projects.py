from fastapi import APIRouter, Depends, HTTPException, WebSocket, Query
from typing import List, Dict
from uuid import UUID
import os

# Import CLI functions directly from the CLI package
from cli import createAPI, editAPI, revertAPI

# Fix the database import
from app.database import (
    supabase, get_db_context
)
from app.models.models import ProjectCreate, ProjectResponse, ChatMessage
from app.websocket import websocket_manager
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/projects/", response_model=ProjectResponse)
async def create_new_project(
    project: ProjectCreate,
    current_user = Depends(get_current_user)
):
    try:
        db = get_db_context(current_user.id) 
        project_data = await db.create_project(project.name, project.description)
        
        # Create initial version
        version = await db.create_version(project_data["id"], 1)
        print(version)
        
        # Update project with version
        project_data["current_version_id"] = version["id"]

        # Need to update the project with the version id
        await db.update_project_metadata(project_data["id"], {"current_version_id": version["id"]})
        
        return project_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/projects/", response_model=List[ProjectResponse])
async def get_user_projects(current_user = Depends(get_current_user)):
    try:
        db = get_db_context(current_user.id)
        response = await db.get_projects()
        return response
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project_details(
    project_id: UUID,
    current_user = Depends(get_current_user)
):
    try:
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/projects/{project_id}/messages")
async def get_project_messages(
    project_id: UUID,
    current_user = Depends(get_current_user)
):
    """
    Fetch chat messages for a project.
    """
    try:
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        messages = await db.get_chat_messages(str(project_id))
        return {
            "status": "success",
            "data": messages
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/projects/{project_id}/versions")
async def get_project_versions(
    project_id: UUID,
    current_user = Depends(get_current_user)
):
    """
    Fetch all versions of an app for a project.
    """
    try:
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        versions = await db.get_project_versions(str(project_id))
        return {
            "status": "success",
            "data": versions
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/projects/{project_id}/versions/{version_id}/use-cases")
async def get_version_use_cases(
    project_id: UUID,
    version_id: UUID,
    current_user = Depends(get_current_user)
):
    """
    Fetch use cases for a specific version of the app.
    """
    try:
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        use_cases = await db.get_version_use_cases(str(project_id), str(version_id))
        return {
            "status": "success",
            "data": use_cases
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/projects/{project_id}/generate")
async def generate_project(
    project_id: UUID,
    message: ChatMessage,
    current_user = Depends(get_current_user)
):
    """
    Creates a new app and generates project files.
    """
    try:
        print(f"Starting project generation for project_id: {project_id}")
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        print(f"Project found: {project}")
        # Access the current_version_id safely
        version_id = project.get('current_version_id')
        if not version_id:
            raise HTTPException(status_code=400, detail="Project has no current version")
        
        # Define the output directory for the project
        output_dir = os.path.join(os.getenv("PROJECT_BASE_DIR"), str(project_id))
        print(f"Output directory set to: {output_dir}")
        
        # WebSocket callback function
        async def broadcast_callback(message: str, project_id: str):
            await db.create_chat_message(str(project_id), "System", message, "loading")
            await websocket_manager.broadcast_to_project(
                project_id,
                {
                    "type": "loading",
                    "message": message,
                    "project_id": project_id,
                    "sender": "System"
                }
            )
        async def sendMessageToFrontend(message: str, type: str, project_id: str):
            await db.create_chat_message(str(project_id), "System", message, type)
            await websocket_manager.broadcast_to_project(
                project_id,
                {
                    "type": type,
                    "message": message,
                    "project_id": project_id,
                    "sender": "System"
                }
            )

        # Save chat message
        await db.create_chat_message(str(project_id), message.sender, message.message, "normal")
        print(f"Chat message saved for project_id: {project_id}")

        await broadcast_callback("Starting project generation", str(project_id))
        await broadcast_callback("Project directory created", str(project_id))

        # Update broadcast calls
        async def status_callback(msg: str):
            await broadcast_callback(msg, str(project_id))
        
        # Call the CLI function
        result = await createAPI(
            description=message.message,
            output_dir=output_dir,
            broadcast_callback=status_callback,
            use_docker=True,
            use_nginx=False
        )
       
        print(f"createAPI result: {result}")
        if result["status"] == "error":
            print(f"Error during project generation: {result['message']}")
            await sendMessageToFrontend("Error during project generation", "error", str(project_id))
            raise HTTPException(status_code=500, detail=result["message"])
        
        # Update project with generated info
        await db.update_project_status(str(project_id), "Ready")
        print(f"Project status updated to Ready for project_id: {project_id}")
        
        
        
        # Update project metadata with output_dir and preview_url
        await db.update_project_metadata(str(project_id), {"current_project_dir": result["output_dir"], "current_project_preview_url": "http://localhost:3006"})
        await status_callback("Project metadata updated in DB")
        #update version status to generated
        await db.update_version_status(str(version_id), "generated")
        await status_callback("Version status updated to Generated")
        #update use cases
        print(f"Saving use cases: {result['use_cases']}")
        await db.save_version_use_cases(str(version_id), result["use_cases"])
        await status_callback("Use cases saved in DB")
        
        await sendMessageToFrontend("Project generation completed, check the project in preview and use cases in the use cases tab", "success", str(project_id))
        return {
            "status": "success",
            "data": {
                "project_id": str(project_id),
                "output_dir": result["output_dir"],
                "preview_url": "http://localhost:3006",
                "use_cases": result["use_cases"]
            }
        }
    
    except Exception as e:
        print(f"Error during project generation: {e}")
        await sendMessageToFrontend(f"Error during project generation: {e}", "error", str(project_id))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/projects/{project_id}/edit")
async def edit_project(
    project_id: UUID,
    message: ChatMessage,
    current_user = Depends(get_current_user)
):
    """
    Edits an existing app and applies changes.
    """
    try:
        db = get_db_context(current_user.id)
        print(f"Current user ID: {current_user}")
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Define project directory
        project_dir = os.path.join(os.getenv("PROJECT_BASE_DIR"), str(project_id))
        #save chat message
        await db.create_chat_message(str(project_id), message.sender, message.message, "normal")
        # WebSocket callback function
        async def broadcast_callback(message: str, project_id: str):
            await db.create_chat_message(str(project_id), "System", message, "loading")
            await websocket_manager.broadcast_to_project(
                project_id,
                {
                    "type": "loading",
                    "message": message,
                    "project_id": project_id,
                    "sender": "System"
                }
            )
        async def status_callback(msg: str):
            await broadcast_callback(msg, str(project_id))
        # Call the CLI function
        result = await editAPI(
            project_dir=project_dir,
            description=message.message,
            broadcast_callback=status_callback,
            use_docker=True,
            use_nginx=False
        )
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        
        # Create new version
        version_number = len(db.get_project_versions(str(project_id))) + 1
        
        version = await db.create_version(
            str(project_id),
            version_number,
            result["backup_dir"]
        )
        #update version status to generated
        await db.update_version_status(str(version["id"]), "generated")
        await status_callback("Version status updated to Generated")
        #save the new version and preview url in project metadata
        await db.update_project_metadata(str(project_id), {"current_version_id": version["id"], "current_project_preview_url": result["preview_url"]})
        await status_callback("Project metadata updated in DB")
        #update use cases
        print(result["use_cases"])
        await db.save_version_use_cases(str(version["id"]), result["use_cases"])
        await status_callback("Use cases saved in DB")
        # Save chat message
        await broadcast_callback({"type": "success", "message": "Project generation completed, check the project in preview and use cases in the use cases tab"}, str(project_id))
        return {
            "status": "success",
            "data": {
                "project_id": str(project_id),
                "backup_dir": result["backup_dir"],
                "preview_url": result["preview_url"],
                "use_cases": result.get("use_cases", {})
            }
        }
    
    except Exception as e:
        await broadcast_callback({"type": "error", "message": f"Error during project generation: {e}"}, str(project_id))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/projects/{project_id}/revert/{version_id}")
async def revert_project(
    project_id: UUID,
    version_id: UUID,
    current_user = Depends(get_current_user)
):
    """
    Reverts an app to a specific version.
    """
    try:
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        version = await db.get_version(str(version_id))
        if not version:
            raise HTTPException(status_code=404, detail="Version not found")
        
        project_dir = os.path.join(os.getenv("PROJECT_BASE_DIR"), str(project_id))
        
        # WebSocket callback function
        async def broadcast_callback(message: str):
            await websocket_manager.broadcast(message)
        
        # Call the CLI function
        result = await revertAPI(
            project_dir=project_dir,
            backup_dir=version["backup_dir"],
            broadcast_callback=broadcast_callback,
            use_docker=True,
            use_nginx=False
        )
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        
        # Update project status and current version
        await db.update_project_status(str(project_id), "Ready")
        await db.update_project_metadata(str(project_id), {
            "current_version_id": str(version_id)
        })
        
        return {
            "status": "success",
            "data": {
                "project_id": str(project_id),
                "preview_url": result["preview_url"]
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: UUID,
    current_user = Depends(get_current_user)
):
    try:
        db = get_db_context(current_user.id)
        project = await db.get_project(str(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Delete project from database
        await db.delete_project(str(project_id))
        
        # Clean up project directory
        if project["current_project_dir"]:
            # Implement cleanup logic here
            pass
        
        return {"status": "success", "message": "Project deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
