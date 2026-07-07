from pydantic import BaseModel
from typing import Optional
import datetime

class VolunteerTaskDTO(BaseModel):
    id: int
    title: str
    description: str
    assigned_to_id: Optional[int]
    status: str
    priority: str
    sector: str
    shift_start: datetime.datetime
    shift_end: datetime.datetime

    class Config:
        from_attributes = True
