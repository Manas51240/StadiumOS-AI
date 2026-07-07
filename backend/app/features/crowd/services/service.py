import datetime
from typing import List
from app.features.crowd.domain.entities import CrowdAlertEntity
from app.features.crowd.domain.repository import CrowdRepository
from app.features.crowd.services.dtos import CrowdAlertDTO, CrowdPredictionDTO, SectorPredictionDTO

class CrowdService:
    def __init__(self, repository: CrowdRepository):
        self.repository = repository

    async def list_alerts(self) -> List[CrowdAlertDTO]:
        alerts = await self.repository.get_all_alerts()
        return [CrowdAlertDTO.model_validate(a) for a in alerts]

    async def log_alert(self, sector: str, congestion_level: str, spectator_count: int, capacity: int, message: str) -> CrowdAlertDTO:
        entity = CrowdAlertEntity(
            sector=sector,
            congestion_level=congestion_level,
            spectator_count=spectator_count,
            capacity=capacity,
            message=message
        )
        saved = await self.repository.save_alert(entity)
        return CrowdAlertDTO.model_validate(saved)

    async def get_congestion_predictions(self) -> CrowdPredictionDTO:
        now = datetime.datetime.now(datetime.timezone.utc)
        hour = now.hour
        base_load = 0.4 if (10 <= hour <= 16) else 0.75
        
        sectors = [
            {"sector": "North Stand", "capacity": 15000, "multiplier": 0.9},
            {"sector": "South Stand", "capacity": 15000, "multiplier": 0.8},
            {"sector": "East Stand", "capacity": 20000, "multiplier": 1.1},
            {"sector": "West Stand", "capacity": 20000, "multiplier": 0.95},
            {"sector": "Main Concourse", "capacity": 10000, "multiplier": 1.3},
            {"sector": "Gate A Plaza", "capacity": 5000, "multiplier": 1.4}
        ]
        
        predictions = []
        for s in sectors:
            load = min(1.0, base_load * s["multiplier"])
            count = int(s["capacity"] * load)
            
            if load >= 0.9:
                level = "critical"
                msg = "Crowd flow optimization requested. Open bypass gates."
            elif load >= 0.75:
                level = "high"
                msg = "High density. Heavy traffic near retail outlets."
            elif load >= 0.5:
                level = "medium"
                msg = "Normal movement, steady queues."
            else:
                level = "low"
                msg = "Clear paths. Low queue wait times."
                
            predictions.append(SectorPredictionDTO(
                sector=s["sector"],
                spectator_count=count,
                capacity=s["capacity"],
                occupancy_rate=f"{int(load * 100)}%",
                congestion_level=level,
                recommendation=msg
            ))
            
        return CrowdPredictionDTO(
            timestamp=now,
            overall_stadium_load="83%",
            predictions=predictions
        )
