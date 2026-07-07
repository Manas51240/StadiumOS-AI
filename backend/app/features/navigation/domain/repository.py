from abc import ABC, abstractmethod
from typing import List, Optional
from app.features.navigation.domain.entities import NavigationNodeEntity


class NavigationRepository(ABC):
    @abstractmethod
    async def get_all_nodes(self) -> List[NavigationNodeEntity]:
        pass

    @abstractmethod
    async def get_node_by_id(self, node_id: int) -> Optional[NavigationNodeEntity]:
        pass

    @abstractmethod
    async def save_node(self, node: NavigationNodeEntity) -> NavigationNodeEntity:
        pass
