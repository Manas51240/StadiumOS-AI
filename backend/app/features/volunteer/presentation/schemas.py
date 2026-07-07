from pydantic import BaseModel, Field
from typing import Optional
import datetime


class VolunteerTaskCreateSchema(BaseModel):
    title: str = Field(..., min_length=2)
    description: str = Field(..., min_length=3)
    assigned_to_id: Optional[int] = None
    status: str = "pending"
    priority: str = "medium"
    sector: str
    shift_start: datetime.datetime
    shift_end: datetime.datetime


class VolunteerTaskUpdateSchema(BaseModel):
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None
    priority: Optional[str] = None
