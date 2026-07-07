from dataclasses import dataclass
import datetime
from typing import Optional


@dataclass
class OperationReportEntity:
    title: str
    created_by_id: int
    report_type: str  # daily, post_match, emergency
    content: str
    confidence_score: float
    created_at: Optional[datetime.datetime] = None
    id: Optional[int] = None
