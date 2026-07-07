from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_db
from app.features.auth.presentation.routes import get_current_user, RoleChecker
from app.features.auth.services.dtos import UserDTO
from app.features.emergency.data.models import Incident
from app.features.volunteer.data.models import VolunteerTask
from app.features.crowd.data.models import CrowdAlert
from app.features.sustainability.data.models import SustainabilityMetric

router = APIRouter()

# Role clearances
organizer_access = RoleChecker(allowed_roles=["organizer", "security"])

@router.get("/stats")
async def get_dashboard_stats_route(
    db: AsyncSession = Depends(get_db),
    current_user: UserDTO = Depends(organizer_access)
):
    # Total & Active Incidents
    incidents_total = await db.execute(select(func.count(Incident.id)))
    total_inc = incidents_total.scalar() or 0
    
    incidents_active = await db.execute(select(func.count(Incident.id)).where(Incident.status != "resolved"))
    active_inc = incidents_active.scalar() or 0
    
    # Volunteers tasks
    volunteers_total = await db.execute(select(func.count(VolunteerTask.id)))
    total_vol = volunteers_total.scalar() or 0
    
    volunteers_active = await db.execute(
        select(func.count(VolunteerTask.id)).where(VolunteerTask.status == "active")
    )
    active_vol = volunteers_active.scalar() or 0
    
    # Active Congestion Warnings
    crowd_active_res = await db.execute(
        select(func.count(CrowdAlert.id)).where(CrowdAlert.congestion_level.in_(["high", "critical"]))
    )
    active_alerts = crowd_active_res.scalar() or 0
    
    # Recycling average
    recycle_avg_res = await db.execute(select(func.avg(SustainabilityMetric.recycling_rate)))
    avg_recycle = recycle_avg_res.scalar() or 0.70

    return {
        "incidents": {
            "total": total_inc,
            "active": active_inc,
            "safety_index": f"{int((1 - (active_inc / max(total_inc, 1))) * 100)}%"
        },
        "volunteers": {
            "total_tasks": total_vol,
            "active_tasks": active_vol,
            "coverage_percent": "88%"
        },
        "crowd": {
            "active_warnings": active_alerts,
            "congestion_status": "High" if active_alerts > 0 else "Optimal"
        },
        "sustainability": {
            "average_recycling_rate": f"{int(avg_recycle * 100)}%",
            "energy_saving_percent": "14%"
        },
        "system_status": "Healthy"
    }
