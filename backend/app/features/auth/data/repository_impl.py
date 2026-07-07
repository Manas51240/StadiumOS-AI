import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.features.auth.domain.entities import UserEntity
from app.features.auth.domain.repository import AuthRepository
from app.features.auth.data.models import User


class SQLAuthRepository(AuthRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    def _to_entity(self, model: User) -> UserEntity:
        return UserEntity(
            id=model.id,
            email=model.email,
            hashed_password=model.hashed_password,
            full_name=model.full_name,
            role=model.role,
            is_active=model.is_active,
            created_at=model.created_at,
        )

    async def get_by_email(self, email: str) -> Optional[UserEntity]:
        res = await self.db.execute(select(User).where(User.email == email))
        model = res.scalars().first()
        return self._to_entity(model) if model else None

    async def get_by_id(self, user_id: int) -> Optional[UserEntity]:
        res = await self.db.execute(select(User).where(User.id == user_id))
        model = res.scalars().first()
        return self._to_entity(model) if model else None

    async def save(self, entity: UserEntity) -> UserEntity:
        if entity.id:
            res = await self.db.execute(select(User).where(User.id == entity.id))
            model = res.scalars().first()
            if model:
                model.email = entity.email
                model.hashed_password = entity.hashed_password
                model.full_name = entity.full_name
                model.role = entity.role
                model.is_active = entity.is_active
        else:
            model = User(
                email=entity.email,
                hashed_password=entity.hashed_password,
                full_name=entity.full_name,
                role=entity.role,
                is_active=entity.is_active,
                created_at=entity.created_at
                or datetime.datetime.now(datetime.timezone.utc),
            )
            self.db.add(model)

        await self.db.flush()
        entity.id = model.id
        entity.created_at = model.created_at
        return entity
