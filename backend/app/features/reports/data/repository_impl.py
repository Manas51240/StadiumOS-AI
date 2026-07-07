import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.features.reports.domain.entities import OperationReportEntity
from app.features.reports.domain.repository import ReportsRepository
from app.features.reports.data.models import OperationReport


class SQLReportsRepository(ReportsRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: OperationReport) -> OperationReportEntity:
        return OperationReportEntity(
            id=model.id,
            title=model.title,
            created_by_id=model.created_by_id,
            report_type=model.report_type,
            content=model.content,
            confidence_score=model.confidence_score,
            created_at=model.created_at,
        )

    async def get_all_reports(self) -> List[OperationReportEntity]:
        res = await self.db.execute(
            select(OperationReport).order_by(OperationReport.created_at.desc())
        )
        return [self._to_entity(m) for m in res.scalars().all()]

    async def save_report(self, entity: OperationReportEntity) -> OperationReportEntity:
        model = OperationReport(
            title=entity.title,
            created_by_id=entity.created_by_id,
            report_type=entity.report_type,
            content=entity.content,
            confidence_score=entity.confidence_score,
            created_at=entity.created_at
            or datetime.datetime.now(datetime.timezone.utc),
        )
        self.db.add(model)
        await self.db.flush()
        entity.id = model.id
        entity.created_at = model.created_at
        return entity
