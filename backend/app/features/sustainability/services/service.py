from typing import List
from app.features.sustainability.domain.entities import SustainabilityMetricEntity
from app.features.sustainability.domain.repository import SustainabilityRepository
from app.features.sustainability.services.dtos import SustainabilityMetricDTO, SustainabilitySummaryDTO

class SustainabilityService:
    def __init__(self, repository: SustainabilityRepository):
        self.repository = repository

    async def list_metrics(self) -> List[SustainabilityMetricDTO]:
        metrics = await self.repository.get_all_metrics()
        if not metrics:
            # Seed default metrics
            default_metrics = [
                SustainabilityMetricEntity(sector="North Stand", power_kwh=1200.5, water_liters=4500.0, waste_kg=350.0, recycling_rate=0.68),
                SustainabilityMetricEntity(sector="South Stand", power_kwh=1150.0, water_liters=4300.0, waste_kg=310.0, recycling_rate=0.72),
                SustainabilityMetricEntity(sector="East Stand", power_kwh=1500.2, water_liters=5900.5, waste_kg=480.0, recycling_rate=0.65),
                SustainabilityMetricEntity(sector="West Stand", power_kwh=1450.8, water_liters=5500.0, waste_kg=420.0, recycling_rate=0.74)
            ]
            for m in default_metrics:
                await self.repository.save_metric(m)
            metrics = await self.repository.get_all_metrics()
            
        return [SustainabilityMetricDTO.model_validate(m) for m in metrics]

    async def log_metric(self, sector: str, power_kwh: float, water_liters: float, waste_kg: float, recycling_rate: float) -> SustainabilityMetricDTO:
        entity = SustainabilityMetricEntity(
            sector=sector,
            power_kwh=power_kwh,
            water_liters=water_liters,
            waste_kg=waste_kg,
            recycling_rate=recycling_rate
        )
        saved = await self.repository.save_metric(entity)
        return SustainabilityMetricDTO.model_validate(saved)

    async def get_summary(self) -> SustainabilitySummaryDTO:
        metrics = await self.repository.get_all_metrics()
        
        # Ensure we have seeded metrics if DB is completely empty
        if not metrics:
            await self.list_metrics()
            metrics = await self.repository.get_all_metrics()
            
        total_power = sum(m.power_kwh for m in metrics)
        total_water = sum(m.water_liters for m in metrics)
        total_waste = sum(m.waste_kg for m in metrics)
        avg_recycling = sum(m.recycling_rate for m in metrics) / len(metrics) if metrics else 0.0
        
        recycled_weight = total_waste * avg_recycling
        carbon_offset_kg = recycled_weight * 0.85
        
        return SustainabilitySummaryDTO(
            total_power_kwh=round(total_power, 2),
            total_water_liters=round(total_water, 2),
            total_waste_kg=round(total_waste, 2),
            average_recycling_rate=f"{int(avg_recycling * 100)}%",
            carbon_offset_kg=round(carbon_offset_kg, 2),
            sustainability_status="excellent" if avg_recycling >= 0.70 else "good",
            highlights=[
                "Solar canopy on Sector West generating 25% of required power.",
                "Compost units processed 120kg of organic waste today.",
                "Water recycling loop at 92% efficiency rate."
            ]
        )
