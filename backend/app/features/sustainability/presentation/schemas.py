from pydantic import BaseModel, Field

class SustainabilityMetricCreateSchema(BaseModel):
    sector: str = Field(..., min_length=2)
    power_kwh: float = Field(..., ge=0.0)
    water_liters: float = Field(..., ge=0.0)
    waste_kg: float = Field(..., ge=0.0)
    recycling_rate: float = Field(..., ge=0.0, le=1.0)
