from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.reports.data.repository_impl import SQLReportsRepository
from app.features.emergency.data.repository_impl import SQLIncidentRepository
from app.features.volunteer.data.repository_impl import SQLVolunteerRepository
from app.features.sustainability.data.repository_impl import SQLSustainabilityRepository
from app.features.reports.services.service import ReportsService
from app.features.reports.services.dtos import OperationReportDTO

router = APIRouter()


# Service Injection Composition Root
def get_reports_service(db: AsyncSession = Depends(get_db)) -> ReportsService:
    return ReportsService(
        reports_repo=SQLReportsRepository(db),
        incidents_repo=SQLIncidentRepository(db),
        tasks_repo=SQLVolunteerRepository(db),
        metrics_repo=SQLSustainabilityRepository(db),
    )


organizer_access = RoleChecker(allowed_roles=["organizer"])


@router.get("", response_model=List[OperationReportDTO])
async def get_reports_route(
    service: ReportsService = Depends(get_reports_service),
    current_user: UserDTO = Depends(organizer_access),
):
    return await service.list_reports()


@router.post(
    "/generate", response_model=OperationReportDTO, status_code=status.HTTP_201_CREATED
)
async def generate_report_route(
    report_type: str = "daily",
    service: ReportsService = Depends(get_reports_service),
    current_user: UserDTO = Depends(organizer_access),
):
    return await service.generate_report(
        report_type=report_type, created_by_id=current_user.id
    )
