from abc import ABC, abstractmethod
from typing import List
from app.features.crowd.domain.entities import CrowdAlertEntity


class CrowdRepository(ABC):
    @abstractmethod
    async def get_all_alerts(self) -> List[CrowdAlertEntity]:
        pass

    @abstractmethod
    async def save_alert(self, alert: CrowdAlertEntity) -> CrowdAlertEntity:
        pass
