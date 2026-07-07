from pydantic import BaseModel
import datetime


class OperationReportDTO(BaseModel):
    id: int
    title: str
    created_by_id: int
    report_type: str
    content: str
    confidence_score: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True
