import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.features.emergency.domain.entities import IncidentEntity
from app.features.emergency.domain.repository import IncidentRepository
from app.features.emergency.data.models import Incident


class SQLIncidentRepository(IncidentRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: Incident) -> IncidentEntity:
        return IncidentEntity(
            id=model.id,
            category=model.category,
            severity=model.severity,
            description=model.description,
            location=model.location,
            reported_by_id=model.reported_by_id,
            status=model.status,
            response_instructions=model.response_instructions,
            created_at=model.created_at,
            resolved_at=model.resolved_at,
        )

    async def get_all_incidents(self) -> List[IncidentEntity]:
        res = await self.db.execute(
            select(Incident).order_by(Incident.created_at.desc())
        )
        return [self._to_entity(m) for m in res.scalars().all()]

    async def get_incident_by_id(self, incident_id: int) -> Optional[IncidentEntity]:
        res = await self.db.execute(select(Incident).where(Incident.id == incident_id))
        model = res.scalars().first()
        return self._to_entity(model) if model else None

    async def save_incident(self, entity: IncidentEntity) -> IncidentEntity:
        if entity.id:
            res = await self.db.execute(
                select(Incident).where(Incident.id == entity.id)
            )
            model = res.scalars().first()
            if model:
                model.category = entity.category
                model.severity = entity.severity
                model.description = entity.description
                model.location = entity.location
                model.status = entity.status
                model.response_instructions = entity.response_instructions
                model.resolved_at = entity.resolved_at
        else:
            model = Incident(
                category=entity.category,
                severity=entity.severity,
                description=entity.description,
                location=entity.location,
                reported_by_id=entity.reported_by_id,
                status=entity.status,
                response_instructions=entity.response_instructions,
                created_at=entity.created_at
                or datetime.datetime.now(datetime.timezone.utc),
            )
            self.db.add(model)

        await self.db.flush()
        entity.id = model.id
        entity.created_at = model.created_at
        entity.resolved_at = model.resolved_at
        return entity
