import datetime
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class CrowdAlert(Base):
    __tablename__ = "crowd_alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sector: Mapped[str] = mapped_column(String(50), index=True)
    congestion_level: Mapped[str] = mapped_column(String(50))
    spectator_count: Mapped[int] = mapped_column(Integer)
    capacity: Mapped[int] = mapped_column(Integer)
    message: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
