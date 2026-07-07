from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.volunteer.data.repository_impl import SQLVolunteerRepository
from app.features.volunteer.services.service import VolunteerService
from app.features.volunteer.services.dtos import VolunteerTaskDTO
from app.features.volunteer.presentation.schemas import (
    VolunteerTaskCreateSchema,
    VolunteerTaskUpdateSchema,
)

router = APIRouter()


def get_volunteer_service(db: AsyncSession = Depends(get_db)) -> VolunteerService:
    repo = SQLVolunteerRepository(db)
    return VolunteerService(repo)


# Role check clearances
organizer_access = RoleChecker(allowed_roles=["organizer"])
staff_access = RoleChecker(allowed_roles=["organizer", "volunteer"])


@router.get("/tasks", response_model=List[VolunteerTaskDTO])
async def get_tasks_route(
    service: VolunteerService = Depends(get_volunteer_service),
    current_user: UserDTO = Depends(staff_access),
):
    return await service.list_tasks(
        user_role=current_user.role, user_id=current_user.id
    )


@router.post(
    "/tasks", response_model=VolunteerTaskDTO, status_code=status.HTTP_201_CREATED
)
async def create_task_route(
    task_in: VolunteerTaskCreateSchema,
    service: VolunteerService = Depends(get_volunteer_service),
    current_user: UserDTO = Depends(organizer_access),
):
    return await service.create_task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        sector=task_in.sector,
        shift_start=task_in.shift_start,
        shift_end=task_in.shift_end,
        assigned_to_id=task_in.assigned_to_id,
    )


@router.put("/tasks/{task_id}", response_model=VolunteerTaskDTO)
async def update_task_route(
    task_id: int,
    task_update: VolunteerTaskUpdateSchema,
    service: VolunteerService = Depends(get_volunteer_service),
    current_user: UserDTO = Depends(staff_access),
):
    return await service.update_task(
        task_id=task_id,
        user_role=current_user.role,
        user_id=current_user.id,
        status=task_update.status,
        assigned_to_id=task_update.assigned_to_id,
        priority=task_update.priority,
    )
