from dataclasses import dataclass
import datetime
from typing import Optional


@dataclass
class VolunteerTaskEntity:
    title: str
    description: str
    priority: str
    sector: str
    shift_start: datetime.datetime
    shift_end: datetime.datetime
    assigned_to_id: Optional[int] = None
    status: str = "pending"
    id: Optional[int] = None
