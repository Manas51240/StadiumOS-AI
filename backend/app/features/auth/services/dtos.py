from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime

class UserDTO(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenDTO(BaseModel):
    access_token: str
    token_type: str
