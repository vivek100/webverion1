from fastapi import Depends, HTTPException, Header
from typing import Optional
from .database import supabase
import jwt
from jwt.exceptions import InvalidTokenError

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Extract token
        token = authorization.split(' ')[1]
        # Verify token with Supabase JWT secret
        # The JWT verification is handled by Supabase client
        user = supabase.auth.get_user(token)
        
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) 