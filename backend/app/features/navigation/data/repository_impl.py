from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.features.navigation.domain.entities import NavigationNodeEntity
from app.features.navigation.domain.repository import NavigationRepository
from app.features.navigation.data.models import NavigationNode


class SQLNavigationRepository(NavigationRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: NavigationNode) -> NavigationNodeEntity:
        return NavigationNodeEntity(
            id=model.id,
            name=model.name,
            type=model.type,
            accessibility_friendly=model.accessibility_friendly,
            lat=model.lat,
            lng=model.lng,
            sector=model.sector,
            details=model.details,
        )

    async def get_all_nodes(self) -> List[NavigationNodeEntity]:
        res = await self.db.execute(select(NavigationNode))
        return [self._to_entity(m) for m in res.scalars().all()]

    async def get_node_by_id(self, node_id: int) -> Optional[NavigationNodeEntity]:
        res = await self.db.execute(
            select(NavigationNode).where(NavigationNode.id == node_id)
        )
        model = res.scalars().first()
        return self._to_entity(model) if model else None

    async def save_node(self, entity: NavigationNodeEntity) -> NavigationNodeEntity:
        if entity.id:
            res = await self.db.execute(
                select(NavigationNode).where(NavigationNode.id == entity.id)
            )
            model = res.scalars().first()
            if model:
                model.name = entity.name
                model.type = entity.type
                model.accessibility_friendly = entity.accessibility_friendly
                model.lat = entity.lat
                model.lng = entity.lng
                model.sector = entity.sector
                model.details = entity.details
        else:
            model = NavigationNode(
                name=entity.name,
                type=entity.type,
                accessibility_friendly=entity.accessibility_friendly,
                lat=entity.lat,
                lng=entity.lng,
                sector=entity.sector,
                details=entity.details,
            )
            self.db.add(model)

        await self.db.flush()
        entity.id = model.id
        return entity
