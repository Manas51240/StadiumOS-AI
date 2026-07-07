import datetime
from typing import List, Optional
from app.features.volunteer.domain.entities import VolunteerTaskEntity
from app.features.volunteer.domain.repository import VolunteerRepository
from app.features.volunteer.services.dtos import VolunteerTaskDTO
from app.core.exceptions.exceptions import EntityNotFoundError, ForbiddenError

class VolunteerService:
    def __init__(self, repository: VolunteerRepository):
        self.repository = repository

    async def list_tasks(self, user_role: str, user_id: int) -> List[VolunteerTaskDTO]:
        if user_role == "organizer":
            tasks = await self.repository.get_all_tasks()
        else:
            tasks = await self.repository.get_tasks_by_assignee_or_unassigned(user_id)
            
        if not tasks and user_role == "organizer":
            now = datetime.datetime.now(datetime.timezone.utc)
            default_tasks = [
                VolunteerTaskEntity(title="Gate D Accessibility Support", description="Assist wheelchair spectators through elevators.", assigned_to_id=None, status="pending", priority="high", sector="West Stand", shift_start=now, shift_end=now + datetime.timedelta(hours=6)),
                VolunteerTaskEntity(title="Concourse Queue Management", description="Manage spectator traffic flow near food courts.", assigned_to_id=user_id, status="active", priority="medium", sector="North Stand", shift_start=now, shift_end=now + datetime.timedelta(hours=4)),
                VolunteerTaskEntity(title="Distribution of Fan Guides", description="Distribute tournament guidelines and recycling bags.", assigned_to_id=None, status="pending", priority="low", sector="East Stand", shift_start=now, shift_end=now + datetime.timedelta(hours=5))
            ]
            for t in default_tasks:
                await self.repository.save_task(t)
            tasks = await self.repository.get_all_tasks()
            
        return [VolunteerTaskDTO.model_validate(t) for t in tasks]

    async def create_task(self, title: str, description: str, priority: str, sector: str, shift_start: datetime.datetime, shift_end: datetime.datetime, assigned_to_id: Optional[int] = None) -> VolunteerTaskDTO:
        entity = VolunteerTaskEntity(
            title=title,
            description=description,
            priority=priority,
            sector=sector,
            shift_start=shift_start,
            shift_end=shift_end,
            assigned_to_id=assigned_to_id
        )
        saved = await self.repository.save_task(entity)
        return VolunteerTaskDTO.model_validate(saved)

    async def update_task(self, task_id: int, user_role: str, user_id: int, status: Optional[str] = None, assigned_to_id: Optional[int] = None, priority: Optional[str] = None) -> VolunteerTaskDTO:
        task = await self.repository.get_task_by_id(task_id)
        if not task:
            raise EntityNotFoundError(f"Volunteer task with ID {task_id} not found.")

        # Volunteer restrictions
        if user_role == "volunteer":
            if assigned_to_id and assigned_to_id != user_id:
                raise ForbiddenError("Volunteers can only assign tasks to themselves.")
            if priority:
                raise ForbiddenError("Volunteers cannot modify task priorities.")

        # Apply edits
        if status is not None:
            task.status = status
        if assigned_to_id is not None:
            task.assigned_to_id = assigned_to_id
        if priority is not None and user_role == "organizer":
            task.priority = priority

        saved = await self.repository.save_task(task)
        return VolunteerTaskDTO.model_validate(saved)
