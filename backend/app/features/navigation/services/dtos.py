from pydantic import BaseModel
from typing import Optional, List


class NavigationNodeDTO(BaseModel):
    id: int
    name: str
    type: str
    accessibility_friendly: bool
    lat: float
    lng: float
    sector: str
    details: Optional[str]

    class Config:
        from_attributes = True


class WaypointDTO(BaseModel):
    name: str
    lat: float
    lng: float
    type: str


class RouteDTO(BaseModel):
    start: str
    end: str
    accessibility_mode: bool
    total_distance_meters: int
    estimated_time_seconds: int
    waypoints: List[WaypointDTO]
    warnings: List[str]
    navigation_assistance_instructions: str
