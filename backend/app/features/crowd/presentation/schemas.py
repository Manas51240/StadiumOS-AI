from pydantic import BaseModel, Field
from typing import Optional


class CrowdAlertCreateSchema(BaseModel):
    sector: str = Field(..., min_length=2)
    congestion_level: str
    spectator_count: int = Field(..., ge=0)
    capacity: int = Field(..., gt=0)
    message: Optional[str] = None
