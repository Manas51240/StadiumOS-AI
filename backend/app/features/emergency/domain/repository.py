from abc import ABC, abstractmethod
from typing import List, Optional
from app.features.emergency.domain.entities import IncidentEntity


class IncidentRepository(ABC):
    @abstractmethod
    async def get_all_incidents(self) -> List[IncidentEntity]:
        pass

    @abstractmethod
    async def get_incident_by_id(self, incident_id: int) -> Optional[IncidentEntity]:
        pass

    @abstractmethod
    async def save_incident(self, incident: IncidentEntity) -> IncidentEntity:
        pass
