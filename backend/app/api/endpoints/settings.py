from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.database import supabase
from app.models.models import UserBase
from typing import Dict

router = APIRouter()

@router.get("/settings/profile", response_model=Dict)
async def get_profile(current_user = Depends(get_current_user)):
    try:
        # Get profile from profiles table
        response = supabase.table('profiles').select("*").eq('id', current_user.id).single().execute()
        
        if response.data:
            return {
                "name": response.data.get("name", ""),
                "email": current_user.email
            }
        
        return {
            "name": "",
            "email": current_user.email
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/settings/profile", response_model=Dict)
async def update_profile(
    profile: UserBase,
    current_user = Depends(get_current_user)
):
    try:
        # Update profile in profiles table
        response = supabase.table('profiles').upsert({
            "id": current_user.id,
            "name": profile.name,
            "updated_at": "now()"
        }).execute()
        
        return {
            "name": response.data[0]["name"],
            "email": current_user.email
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/settings/usage", response_model=Dict)
async def get_usage(current_user = Depends(get_current_user)):
    # Placeholder for usage statistics
    return {
        "message": "Usage statistics coming soon"
    }

@router.get("/settings/subscription", response_model=Dict)
async def get_subscription(current_user = Depends(get_current_user)):
    # Placeholder for subscription information
    return {
        "message": "Subscription information coming soon"
    } 