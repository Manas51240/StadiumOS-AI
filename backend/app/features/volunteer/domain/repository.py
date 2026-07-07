from abc import ABC, abstractmethod
from typing import List, Optional
from app.features.volunteer.domain.entities import VolunteerTaskEntity

class VolunteerRepository(ABC):
    @abstractmethod
    async def get_all_tasks(self) -> List[VolunteerTaskEntity]:
        pass

    @abstractmethod
    async def get_tasks_by_assignee_or_unassigned(self, user_id: int) -> List[VolunteerTaskEntity]:
        pass

    @abstractmethod
    async def get_task_by_id(self, task_id: int) -> Optional[VolunteerTaskEntity]:
        pass

    @abstractmethod
    async def save_task(self, task: VolunteerTaskEntity) -> VolunteerTaskEntity:
        pass
