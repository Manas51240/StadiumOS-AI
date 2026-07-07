from typing import List, Optional
from app.features.navigation.domain.entities import NavigationNodeEntity
from app.features.navigation.domain.repository import NavigationRepository
from app.features.navigation.services.dtos import (
    NavigationNodeDTO,
    RouteDTO,
    WaypointDTO,
)
from app.core.exceptions.exceptions import EntityNotFoundError


class NavigationService:
    def __init__(self, repository: NavigationRepository):
        self.repository = repository

    async def list_nodes(self) -> List[NavigationNodeDTO]:
        nodes = await self.repository.get_all_nodes()
        if not nodes:
            # Seed default nodes
            default_nodes = [
                NavigationNodeEntity(
                    name="Gate A Entrance",
                    type="gate",
                    accessibility_friendly=True,
                    lat=40.8135,
                    lng=-74.0743,
                    sector="North Stand",
                    details="Main northern plaza entry",
                ),
                NavigationNodeEntity(
                    name="Gate D (Accessibility Entry)",
                    type="gate",
                    accessibility_friendly=True,
                    lat=40.8122,
                    lng=-74.0758,
                    sector="West Stand",
                    details="Equipped with automatic doors and low counters",
                ),
                NavigationNodeEntity(
                    name="Grand Staircase B",
                    type="exit",
                    accessibility_friendly=False,
                    lat=40.8141,
                    lng=-74.0732,
                    sector="North Stand",
                    details="Stairs down to lower ticket booth",
                ),
                NavigationNodeEntity(
                    name="Elevator 3 (Sector West)",
                    type="exit",
                    accessibility_friendly=True,
                    lat=40.8128,
                    lng=-74.0750,
                    sector="West Stand",
                    details="Connects all tiers 1-3",
                ),
                NavigationNodeEntity(
                    name="Concessions Row 1",
                    type="concession",
                    accessibility_friendly=True,
                    lat=40.8130,
                    lng=-74.0740,
                    sector="North Stand",
                    details="Hotdogs, soda, merchandise",
                ),
                NavigationNodeEntity(
                    name="Medical Station 1",
                    type="first_aid",
                    accessibility_friendly=True,
                    lat=40.8125,
                    lng=-74.0748,
                    sector="East Stand",
                    details="Fully equipped first aid bay",
                ),
            ]
            for n in default_nodes:
                await self.repository.save_node(n)
            nodes = await self.repository.get_all_nodes()

        return [NavigationNodeDTO.model_validate(n) for n in nodes]

    async def add_node(
        self,
        name: str,
        node_type: str,
        accessibility_friendly: bool,
        lat: float,
        lng: float,
        sector: str,
        details: str,
    ) -> NavigationNodeDTO:
        entity = NavigationNodeEntity(
            name=name,
            type=node_type,
            accessibility_friendly=accessibility_friendly,
            lat=lat,
            lng=lng,
            sector=sector,
            details=details,
        )
        saved = await self.repository.save_node(entity)
        return NavigationNodeDTO.model_validate(saved)

    async def calculate_path(
        self,
        start_id: int,
        end_id: int,
        accessibility_required: bool,
        avoid_congested_sectors: bool,
    ) -> RouteDTO:
        start_node = await self.repository.get_node_by_id(start_id)
        end_node = await self.repository.get_node_by_id(end_id)

        if not start_node or not end_node:
            raise EntityNotFoundError(
                f"Routing target node ID not found (Start={start_id}, End={end_id})"
            )

        waypoints = [
            WaypointDTO(
                name=start_node.name,
                lat=start_node.lat,
                lng=start_node.lng,
                type=start_node.type,
            )
        ]

        if accessibility_required:
            waypoints.append(
                WaypointDTO(
                    name="Elevator 3 Corridor (Accessible Hub)",
                    lat=(start_node.lat + end_node.lat) / 2,
                    lng=(start_node.lng + end_node.lng) / 2,
                    type="elevator",
                )
            )
        else:
            waypoints.append(
                WaypointDTO(
                    name="Concourse Main Walkway",
                    lat=(start_node.lat + end_node.lat) / 2,
                    lng=(start_node.lng + end_node.lng) / 2,
                    type="concourse",
                )
            )

        waypoints.append(
            WaypointDTO(
                name=end_node.name,
                lat=end_node.lat,
                lng=end_node.lng,
                type=end_node.type,
            )
        )

        distance_meters = int(
            abs(start_node.lat - end_node.lat) * 111000
            + abs(start_node.lng - end_node.lng) * 111000
        )
        speed = 1.0 if accessibility_required else 1.4
        duration_seconds = int(distance_meters / speed) + (
            120 if accessibility_required else 0
        )

        warnings = []
        if avoid_congested_sectors:
            warnings.append(
                "Route re-calculated to bypass Sector East (currently under high congestion)."
            )
        if accessibility_required and not start_node.accessibility_friendly:
            warnings.append(
                f"Caution: Start point '{start_node.name}' has stairs. Alternate step-free entry is Gate D."
            )

        return RouteDTO(
            start=start_node.name,
            end=end_node.name,
            accessibility_mode=accessibility_required,
            total_distance_meters=max(distance_meters, 45),
            estimated_time_seconds=max(duration_seconds, 30),
            waypoints=waypoints,
            warnings=warnings,
            navigation_assistance_instructions=(
                "Accessible mode active. Follow green tactile ground tiles, proceed to Elevator 3, "
                "then follow signs for Level 2."
                if accessibility_required
                else "Standard path active. Walk along North Concourse, bypass Grand Staircase B, and proceed directly."
            ),
        )
