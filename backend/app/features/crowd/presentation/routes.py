from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.crowd.data.repository_impl import SQLCrowdRepository
from app.features.crowd.services.service import CrowdService
from app.features.crowd.services.dtos import CrowdAlertDTO, CrowdPredictionDTO
from app.features.crowd.presentation.schemas import CrowdAlertCreateSchema

router = APIRouter()

def get_crowd_service(db: AsyncSession = Depends(get_db)) -> CrowdService:
    repo = SQLCrowdRepository(db)
    return CrowdService(repo)

# Role check clearances
write_access = RoleChecker(allowed_roles=["organizer", "security", "volunteer"])

@router.get("/alerts", response_model=List[CrowdAlertDTO])
async def get_alerts_route(
    service: CrowdService = Depends(get_crowd_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.list_alerts()

@router.post("/alerts", response_model=CrowdAlertDTO, status_code=status.HTTP_201_CREATED)
async def create_alert_route(
    alert_in: CrowdAlertCreateSchema,
    service: CrowdService = Depends(get_crowd_service),
    current_user: UserDTO = Depends(write_access)
):
    return await service.log_alert(
        sector=alert_in.sector,
        congestion_level=alert_in.congestion_level,
        spectator_count=alert_in.spectator_count,
        capacity=alert_in.capacity,
        message=alert_in.message or ""
    )

@router.get("/prediction", response_model=CrowdPredictionDTO)
async def get_prediction_route(
    service: CrowdService = Depends(get_crowd_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.get_congestion_predictions()
