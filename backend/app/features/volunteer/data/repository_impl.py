import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from app.features.volunteer.domain.entities import VolunteerTaskEntity
from app.features.volunteer.domain.repository import VolunteerRepository
from app.features.volunteer.data.models import VolunteerTask

class SQLVolunteerRepository(VolunteerRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: VolunteerTask) -> VolunteerTaskEntity:
        return VolunteerTaskEntity(
            id=model.id,
            title=model.title,
            description=model.description,
            priority=model.priority,
            sector=model.sector,
            shift_start=model.shift_start,
            shift_end=model.shift_end,
            assigned_to_id=model.assigned_to_id,
            status=model.status
        )

    async def get_all_tasks(self) -> List[VolunteerTaskEntity]:
        res = await self.db.execute(
            select(VolunteerTask).order_by(VolunteerTask.priority.desc())
        )
        return [self._to_entity(m) for m in res.scalars().all()]

    async def get_tasks_by_assignee_or_unassigned(self, user_id: int) -> List[VolunteerTaskEntity]:
        res = await self.db.execute(
            select(VolunteerTask)
            .where(or_(VolunteerTask.assigned_to_id == user_id, VolunteerTask.assigned_to_id.is_(None)))
            .order_by(VolunteerTask.priority.desc())
        )
        return [self._to_entity(m) for m in res.scalars().all()]

    async def get_task_by_id(self, task_id: int) -> Optional[VolunteerTaskEntity]:
        res = await self.db.execute(select(VolunteerTask).where(VolunteerTask.id == task_id))
        model = res.scalars().first()
        return self._to_entity(model) if model else None

    async def save_task(self, entity: VolunteerTaskEntity) -> VolunteerTaskEntity:
        if entity.id:
            res = await self.db.execute(select(VolunteerTask).where(VolunteerTask.id == entity.id))
            model = res.scalars().first()
            if model:
                model.title = entity.title
                model.description = entity.description
                model.priority = entity.priority
                model.sector = entity.sector
                model.shift_start = entity.shift_start
                model.shift_end = entity.shift_end
                model.assigned_to_id = entity.assigned_to_id
                model.status = entity.status
        else:
            model = VolunteerTask(
                title=entity.title,
                description=entity.description,
                priority=entity.priority,
                sector=entity.sector,
                shift_start=entity.shift_start,
                shift_end=entity.shift_end,
                assigned_to_id=entity.assigned_to_id,
                status=entity.status
            )
            self.db.add(model)
            
        await self.db.flush()
        entity.id = model.id
        return entity
