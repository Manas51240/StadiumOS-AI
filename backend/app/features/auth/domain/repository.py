from abc import ABC, abstractmethod
from typing import Optional
from app.features.auth.domain.entities import UserEntity

class AuthRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[UserEntity]:
        pass

    @abstractmethod
    async def get_by_id(self, user_id: int) -> Optional[UserEntity]:
        pass

    @abstractmethod
    async def save(self, user: UserEntity) -> UserEntity:
        pass
