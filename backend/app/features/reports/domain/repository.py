from abc import ABC, abstractmethod
from typing import List
from app.features.reports.domain.entities import OperationReportEntity


class ReportsRepository(ABC):
    @abstractmethod
    async def get_all_reports(self) -> List[OperationReportEntity]:
        pass

    @abstractmethod
    async def save_report(self, report: OperationReportEntity) -> OperationReportEntity:
        pass
