from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    name: str
    email: str

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    status: str
    current_version_id: Optional[UUID]
    current_project_dir: Optional[str]
    current_project_preview_url: Optional[str]
    created_at: datetime
    updated_at: datetime

class VersionBase(BaseModel):
    project_id: UUID
    version_number: int
    backup_dir: Optional[str]
    status: str
    created_at: datetime

class ChatMessage(BaseModel):
    project_id: UUID
    sender: str
    message: str
    type: str = "normal"

class UseCase(BaseModel):
    title: str
    description: str 