from dataclasses import dataclass
import datetime
from typing import Optional

@dataclass
class SustainabilityMetricEntity:
    sector: str
    power_kwh: float
    water_liters: float
    waste_kg: float
    recycling_rate: float
    timestamp: Optional[datetime.datetime] = None
    id: Optional[int] = None
