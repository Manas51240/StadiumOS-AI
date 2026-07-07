from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.sustainability.data.repository_impl import SQLSustainabilityRepository
from app.features.sustainability.services.service import SustainabilityService
from app.features.sustainability.services.dtos import SustainabilityMetricDTO, SustainabilitySummaryDTO
from app.features.sustainability.presentation.schemas import SustainabilityMetricCreateSchema

router = APIRouter()

def get_sustainability_service(db: AsyncSession = Depends(get_db)) -> SustainabilityService:
    repo = SQLSustainabilityRepository(db)
    return SustainabilityService(repo)

organizer_access = RoleChecker(allowed_roles=["organizer"])

@router.get("/metrics", response_model=List[SustainabilityMetricDTO])
async def get_metrics_route(
    service: SustainabilityService = Depends(get_sustainability_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.list_metrics()

@router.post("/metrics", response_model=SustainabilityMetricDTO, status_code=status.HTTP_201_CREATED)
async def log_metric_route(
    metric_in: SustainabilityMetricCreateSchema,
    service: SustainabilityService = Depends(get_sustainability_service),
    current_user: UserDTO = Depends(organizer_access)
):
    return await service.log_metric(
        sector=metric_in.sector,
        power_kwh=metric_in.power_kwh,
        water_liters=metric_in.water_liters,
        waste_kg=metric_in.waste_kg,
        recycling_rate=metric_in.recycling_rate
    )

@router.get("/summary", response_model=SustainabilitySummaryDTO)
async def get_summary_route(
    service: SustainabilityService = Depends(get_sustainability_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.get_summary()
