from pydantic import BaseModel
import datetime
from typing import List

class SustainabilityMetricDTO(BaseModel):
    id: int
    sector: str
    power_kwh: float
    water_liters: float
    waste_kg: float
    recycling_rate: float
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class SustainabilitySummaryDTO(BaseModel):
    total_power_kwh: float
    total_water_liters: float
    total_waste_kg: float
    average_recycling_rate: str
    carbon_offset_kg: float
    sustainability_status: str
    highlights: List[str]
