from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.navigation.data.repository_impl import SQLNavigationRepository
from app.features.navigation.services.service import NavigationService
from app.features.navigation.services.dtos import NavigationNodeDTO, RouteDTO
from app.features.navigation.presentation.schemas import NavigationNodeCreateSchema

router = APIRouter()

def get_navigation_service(db: AsyncSession = Depends(get_db)) -> NavigationService:
    repo = SQLNavigationRepository(db)
    return NavigationService(repo)

admin_access = RoleChecker(allowed_roles=["organizer"])

@router.get("/nodes", response_model=List[NavigationNodeDTO])
async def get_nodes_route(
    service: NavigationService = Depends(get_navigation_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.list_nodes()

@router.post("/nodes", response_model=NavigationNodeDTO, status_code=status.HTTP_201_CREATED)
async def create_node_route(
    node_in: NavigationNodeCreateSchema,
    service: NavigationService = Depends(get_navigation_service),
    current_user: UserDTO = Depends(admin_access)
):
    return await service.add_node(
        name=node_in.name,
        node_type=node_in.type,
        accessibility_friendly=node_in.accessibility_friendly,
        lat=node_in.lat,
        lng=node_in.lng,
        sector=node_in.sector,
        details=node_in.details or ""
    )

@router.get("/route", response_model=RouteDTO)
async def calculate_route_route(
    start_id: int,
    end_id: int,
    accessibility_required: bool = False,
    avoid_congested_sectors: bool = True,
    service: NavigationService = Depends(get_navigation_service),
    current_user: UserDTO = Depends(get_current_user)
):
    return await service.calculate_path(
        start_id=start_id,
        end_id=end_id,
        accessibility_required=accessibility_required,
        avoid_congested_sectors=avoid_congested_sectors
    )
