from pydantic import BaseModel
from typing import Optional
import datetime


class IncidentDTO(BaseModel):
    id: int
    category: str
    severity: str
    description: str
    location: str
    reported_by_id: int
    status: str
    response_instructions: Optional[str]
    created_at: datetime.datetime
    resolved_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True
