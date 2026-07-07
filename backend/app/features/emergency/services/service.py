import datetime
from typing import List
from app.features.emergency.domain.entities import IncidentEntity
from app.features.emergency.domain.repository import IncidentRepository
from app.features.emergency.services.dtos import IncidentDTO
from app.core.exceptions.exceptions import EntityNotFoundError
from app.services.ai import ai_service
from app.features.assistant.presentation.schemas import ChatRequest

class EmergencyService:
    def __init__(self, repository: IncidentRepository):
        self.repository = repository

    async def list_incidents(self) -> List[IncidentDTO]:
        incidents = await self.repository.get_all_incidents()
        return [IncidentDTO.model_validate(i) for i in incidents]

    async def report_incident(self, category: str, severity: str, description: str, location: str, reported_by_id: int) -> IncidentDTO:
        # Request safety guidelines from AI service
        ai_request = ChatRequest(
            message=(
                f"Generate immediate dispatcher response instructions for a {severity} "
                f"{category} incident located at '{location}'. "
                f"Details: {description}. Keep response short, concise, and clear."
            ),
            user_role="security",
            language="en"
        )
        
        try:
            ai_response = await ai_service.get_chat_response(ai_request)
            instructions = ai_response.reply
        except Exception:
            instructions = (
                "Dispatch local sector response team immediately. Keep exit pathways clear. "
                "Await coordinator arrival."
            )

        entity = IncidentEntity(
            category=category,
            severity=severity,
            description=description,
            location=location,
            reported_by_id=reported_by_id,
            response_instructions=instructions
        )
        saved = await self.repository.save_incident(entity)
        return IncidentDTO.model_validate(saved)

    async def resolve_incident(self, incident_id: int) -> IncidentDTO:
        incident = await self.repository.get_incident_by_id(incident_id)
        if not incident:
            raise EntityNotFoundError(f"Incident with id {incident_id} not found.")
            
        incident.status = "resolved"
        incident.resolved_at = datetime.datetime.now(datetime.timezone.utc)
        saved = await self.repository.save_incident(incident)
        return IncidentDTO.model_validate(saved)
