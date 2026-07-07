from pydantic import BaseModel
from typing import Optional, List
import datetime

class CrowdAlertDTO(BaseModel):
    id: int
    sector: str
    congestion_level: str
    spectator_count: int
    capacity: int
    message: Optional[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class SectorPredictionDTO(BaseModel):
    sector: str
    spectator_count: int
    capacity: int
    occupancy_rate: str
    congestion_level: str
    recommendation: str

class CrowdPredictionDTO(BaseModel):
    timestamp: datetime.datetime
    overall_stadium_load: str
    predictions: List[SectorPredictionDTO]
