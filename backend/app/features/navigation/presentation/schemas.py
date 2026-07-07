from pydantic import BaseModel, Field
from typing import Optional

class NavigationNodeCreateSchema(BaseModel):
    name: str = Field(..., min_length=2)
    type: str
    accessibility_friendly: bool
    lat: float
    lng: float
    sector: str
    details: Optional[str] = None
