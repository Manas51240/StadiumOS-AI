import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.features.sustainability.domain.entities import SustainabilityMetricEntity
from app.features.sustainability.domain.repository import SustainabilityRepository
from app.features.sustainability.data.models import SustainabilityMetric


class SQLSustainabilityRepository(SustainabilityRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: SustainabilityMetric) -> SustainabilityMetricEntity:
        return SustainabilityMetricEntity(
            id=model.id,
            sector=model.sector,
            power_kwh=model.power_kwh,
            water_liters=model.water_liters,
            waste_kg=model.waste_kg,
            recycling_rate=model.recycling_rate,
            timestamp=model.timestamp,
        )

    async def get_all_metrics(self) -> List[SustainabilityMetricEntity]:
        res = await self.db.execute(
            select(SustainabilityMetric).order_by(SustainabilityMetric.timestamp.desc())
        )
        return [self._to_entity(m) for m in res.scalars().all()]

    async def save_metric(
        self, entity: SustainabilityMetricEntity
    ) -> SustainabilityMetricEntity:
        model = SustainabilityMetric(
            sector=entity.sector,
            power_kwh=entity.power_kwh,
            water_liters=entity.water_liters,
            waste_kg=entity.waste_kg,
            recycling_rate=entity.recycling_rate,
            timestamp=entity.timestamp or datetime.datetime.now(datetime.timezone.utc),
        )
        self.db.add(model)
        await self.db.flush()
        entity.id = model.id
        entity.timestamp = model.timestamp
        return entity
