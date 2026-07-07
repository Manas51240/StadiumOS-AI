from sqlalchemy import String, Integer, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class NavigationNode(Base):
    __tablename__ = "navigation_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(
        String(50)
    )  # gate, seat, concession, restroom, exit, first_aid
    accessibility_friendly: Mapped[bool] = mapped_column(Boolean, default=True)
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    sector: Mapped[str] = mapped_column(String(50))
    details: Mapped[str] = mapped_column(String(500), nullable=True)
