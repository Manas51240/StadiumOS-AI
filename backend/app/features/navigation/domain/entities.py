from dataclasses import dataclass
from typing import Optional


@dataclass
class NavigationNodeEntity:
    name: str
    type: str  # gate, seat, concession, restroom, exit, first_aid
    accessibility_friendly: bool
    lat: float
    lng: float
    sector: str
    details: Optional[str] = None
    id: Optional[int] = None
