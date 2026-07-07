from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.emergency.data.repository_impl import SQLIncidentRepository
from app.features.emergency.services.service import EmergencyService
from app.features.emergency.services.dtos import IncidentDTO
from app.features.emergency.presentation.schemas import IncidentCreateSchema

router = APIRouter()

def get_emergency_service(db: AsyncSession = Depends(get_db)) -> EmergencyService:
    repo = SQLIncidentRepository(db)
    return EmergencyService(repo)

# Role check clearances
staff_access = RoleChecker(allowed_roles=["organizer", "security", "volunteer"])
security_access = RoleChecker(allowed_roles=["organizer", "security"])

@router.get("/incidents", response_model=List[IncidentDTO])
async def get_incidents_route(
    service: EmergencyService = Depends(get_emergency_service),
    current_user: UserDTO = Depends(staff_access)
):
    return await service.list_incidents()

@router.post("/incidents", response_model=IncidentDTO, status_code=status.HTTP_201_CREATED)
async def report_incident_route(
    incident_in: IncidentCreateSchema,
    service: EmergencyService = Depends(get_emergency_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.report_incident(
        category=incident_in.category,
        severity=incident_in.severity,
        description=incident_in.description,
        location=incident_in.location,
        reported_by_id=current_user.id
    )

@router.put("/incidents/{incident_id}/resolve", response_model=IncidentDTO)
async def resolve_incident_route(
    incident_id: int,
    service: EmergencyService = Depends(get_emergency_service),
    current_user: UserDTO = Depends(security_access)
):
    return await service.resolve_incident(incident_id=incident_id)
