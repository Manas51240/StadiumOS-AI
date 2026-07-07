from dataclasses import dataclass
import datetime
from typing import Optional

@dataclass
class IncidentEntity:
    category: str
    severity: str
    description: str
    location: str
    reported_by_id: int
    status: str = "reported"
    response_instructions: Optional[str] = None
    created_at: Optional[datetime.datetime] = None
    resolved_at: Optional[datetime.datetime] = None
    id: Optional[int] = None
