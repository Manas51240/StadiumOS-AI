import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.features.crowd.domain.entities import CrowdAlertEntity
from app.features.crowd.domain.repository import CrowdRepository
from app.features.crowd.data.models import CrowdAlert


class SQLCrowdRepository(CrowdRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: CrowdAlert) -> CrowdAlertEntity:
        return CrowdAlertEntity(
            id=model.id,
            sector=model.sector,
            congestion_level=model.congestion_level,
            spectator_count=model.spectator_count,
            capacity=model.capacity,
            message=model.message,
            created_at=model.created_at,
        )

    async def get_all_alerts(self) -> List[CrowdAlertEntity]:
        res = await self.db.execute(
            select(CrowdAlert).order_by(CrowdAlert.created_at.desc())
        )
        return [self._to_entity(m) for m in res.scalars().all()]

    async def save_alert(self, entity: CrowdAlertEntity) -> CrowdAlertEntity:
        model = CrowdAlert(
            sector=entity.sector,
            congestion_level=entity.congestion_level,
            spectator_count=entity.spectator_count,
            capacity=entity.capacity,
            message=entity.message,
            created_at=entity.created_at
            or datetime.datetime.now(datetime.timezone.utc),
        )
        self.db.add(model)
        await self.db.flush()
        entity.id = model.id
        entity.created_at = model.created_at
        return entity
