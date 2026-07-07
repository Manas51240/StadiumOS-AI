from dataclasses import dataclass
import datetime
from typing import Optional


@dataclass
class CrowdAlertEntity:
    sector: str
    congestion_level: str
    spectator_count: int
    capacity: int
    message: Optional[str] = None
    created_at: Optional[datetime.datetime] = None
    id: Optional[int] = None
