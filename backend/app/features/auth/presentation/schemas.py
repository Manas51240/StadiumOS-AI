from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)
    full_name: Optional[str] = None
    role: str = "spectator"

class LoginSchema(BaseModel):
    email: EmailStr
    password: str
