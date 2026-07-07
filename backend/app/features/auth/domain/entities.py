from dataclasses import dataclass
import datetime
from typing import Optional


@dataclass
class UserEntity:
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    role: str = "spectator"
    is_active: bool = True
    created_at: Optional[datetime.datetime] = None
    id: Optional[int] = None
