from app.features.auth.domain.entities import UserEntity
from app.features.auth.domain.repository import AuthRepository
from app.features.auth.services.dtos import UserDTO, TokenDTO
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions.exceptions import (
    ConflictError,
    UnauthorizedError,
    EntityNotFoundError,
    ValidationError,
)


class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository

    async def signup(
        self, email: str, password: str, full_name: str, role: str
    ) -> UserDTO:
        # Check if email is in use
        existing = await self.repository.get_by_email(email)
        if existing:
            raise ConflictError(f"Email '{email}' is already registered in the system.")

        hashed_password = get_password_hash(password)
        entity = UserEntity(
            email=email, hashed_password=hashed_password, full_name=full_name, role=role
        )
        saved = await self.repository.save(entity)
        return UserDTO.model_validate(saved)

    async def login(self, email: str, password: str) -> TokenDTO:
        user = await self.repository.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedError("Incorrect email or password credentials.")

        token = create_access_token(subject=user.id)
        return TokenDTO(access_token=token, token_type="bearer")

    async def get_by_id(self, user_id: int) -> UserDTO:
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise EntityNotFoundError(f"User account not found for id {user_id}")
        if not user.is_active:
            raise ValidationError("User account is inactive.")
        return UserDTO.model_validate(user)
