from supabase import create_client, Client
import os
from dotenv import load_dotenv
from typing import Optional, List, Dict
from datetime import datetime
from fastapi import HTTPException

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

class DatabaseContext:
    def __init__(self, user_id: str):
        self.user_id = user_id
    
    async def get_user_by_id(self) -> Dict:
        response = supabase.table('profiles').select("*").eq('id', self.user_id).single().execute()
        return response.data
    
    async def create_project(self, name: str, description: str) -> Dict:
        project_data = {
            "user_id": self.user_id,
            "name": name,
            "description": description,
            "status": "Created"
        }
        response = supabase.table('projects').insert(project_data).execute()
        return response.data[0]
    
    async def get_projects(self) -> List[Dict]:
        """Get all projects for the current user"""
        response = supabase.table('projects').select("*").eq('user_id', self.user_id).execute()
        print(response.data)
        return response.data
    
    async def get_project(self, project_id: str) -> Dict:
        response = supabase.table('projects').select("*").eq('id', project_id).eq('user_id', self.user_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return response.data
    
    async def update_project_status(self, project_id: str, status: str) -> Dict:
        response = supabase.table('projects').update({"status": status}).eq('id', project_id).eq('user_id', self.user_id).execute()
        return response.data[0]
    
    async def update_project_metadata(self, project_id: str, metadata: Dict) -> Dict:
        """Update project metadata like current_version_id, current_project_dir, etc."""
        response = supabase.table('projects').update(metadata).eq('id', project_id).eq('user_id', self.user_id).execute()
        return response.data[0]
    
    async def delete_project(self, project_id: str) -> None:
        """Delete a project and its associated data"""
        response = supabase.table('projects').delete().eq('id', project_id).eq('user_id', self.user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
    
    async def create_version(self, project_id: str, version_number: int, backup_dir: str = "") -> Dict:
        version_data = {
            "project_id": project_id,
            "version_number": version_number,
            "backup_dir": backup_dir,
            "status": "notGenerated"
        }
        response = supabase.table('versions').insert(version_data).execute()
        return response.data[0]
    
    async def get_version(self, version_id: str) -> Dict:
        """Get a specific version by ID"""
        response = supabase.table('versions').select("*").eq('id', version_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Version not found")
        return response.data
    
    async def get_project_versions(self, project_id: str) -> List[Dict]:
        """Get all versions for a project"""
        response = supabase.table('versions').select("*").eq('project_id', project_id).order('version_number').execute()
        return response.data
    
    async def get_chat_messages(self, project_id: str) -> List[Dict]:
        """Get all chat messages for a project"""
        response = supabase.table('chat_messages').select("*").eq('project_id', project_id).order('created_at').execute()
        return response.data
    
    async def create_chat_message(self, project_id: str, sender: str, message: str, type: str = "normal") -> Dict:
        """Create a new chat message"""
        message_data = {
            "project_id": project_id,
            "user_id": self.user_id,
            "sender": sender,
            "message": message,
            "type": type
        }
        response = supabase.table('chat_messages').insert(message_data).execute()
        return response.data[0]
    
    async def get_version_use_cases(self, project_id: str, version_id: str) -> List[Dict]:
        """Get all use cases for a specific version"""
        response = supabase.table('use_cases').select("*").eq('version_id', version_id).execute()
        return response.data
    
    #function to save version use cases
    async def save_version_use_cases(self, version_id: str, use_cases_data: dict) -> None:
        # Format the use cases to match the database schema
        formatted_use_cases = [
            {
                'version_id': version_id,
                'title': use_case['name'],
                'description': use_case['description']
            }
            for use_case in use_cases_data['use_cases']
        ]
        
        try:
            # Insert all use cases at once
            response = supabase.table('use_cases').insert(formatted_use_cases).execute()
            print(f"Use cases saved successfully: {response.data}")
            return response.data
        except Exception as e:
            print(f"Error saving use cases: {e}")
            raise e
    #function to update version status
    async def update_version_status(self, version_id: str, status: str) -> None:
        response = supabase.table('versions').update({"status": status}).eq('id', version_id).execute()
        return response.data[0]

def get_db_context(user_id: str) -> DatabaseContext:
    return DatabaseContext(user_id) 