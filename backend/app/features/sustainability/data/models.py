import datetime
from sqlalchemy import String, Integer, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class SustainabilityMetric(Base):
    __tablename__ = "sustainability_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sector: Mapped[str] = mapped_column(String(50))
    power_kwh: Mapped[float] = mapped_column(Float)
    water_liters: Mapped[float] = mapped_column(Float)
    waste_kg: Mapped[float] = mapped_column(Float)
    recycling_rate: Mapped[float] = mapped_column(Float)
    timestamp: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
