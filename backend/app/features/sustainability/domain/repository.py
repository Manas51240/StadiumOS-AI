from abc import ABC, abstractmethod
from typing import List
from app.features.sustainability.domain.entities import SustainabilityMetricEntity

class SustainabilityRepository(ABC):
    @abstractmethod
    async def get_all_metrics(self) -> List[SustainabilityMetricEntity]:
        pass

    @abstractmethod
    async def save_metric(self, metric: SustainabilityMetricEntity) -> SustainabilityMetricEntity:
        pass
