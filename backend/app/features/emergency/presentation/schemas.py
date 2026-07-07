from pydantic import BaseModel, Field


class IncidentCreateSchema(BaseModel):
    category: str = Field(..., min_length=2)
    severity: str
    description: str = Field(..., min_length=5)
    location: str = Field(..., min_length=3)


class Config:
    from_attributes = True
