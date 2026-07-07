from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.core.exceptions.exceptions import UnauthorizedError, ForbiddenError
from app.core.security import decode_access_token
from app.features.auth.data.repository_impl import SQLAuthRepository
from app.features.auth.services.service import AuthService
from app.features.auth.services.dtos import UserDTO, TokenDTO
from app.features.auth.presentation.schemas import UserCreateSchema, LoginSchema

router = APIRouter()

# Dependency Injection helper for AuthService
def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    repo = SQLAuthRepository(db)
    return AuthService(repo)

# OAuth2 Scheme Configuration
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login/oauth2"
)

# Authentication and Authorization DI Hooks
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service)
) -> UserDTO:
    user_id = decode_access_token(token)
    if not user_id:
        raise UnauthorizedError("Session expired or invalid authorization credentials.")
    return await service.get_by_id(int(user_id))

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: UserDTO = Depends(get_current_user)) -> UserDTO:
        if current_user.role not in self.allowed_roles:
            raise ForbiddenError(
                f"Role '{current_user.role}' does not have permission to access this resource. Allowed: {self.allowed_roles}"
            )
        return current_user

# Endpoints
@router.post("/signup", response_model=UserDTO, status_code=status.HTTP_201_CREATED)
async def signup_route(
    user_in: UserCreateSchema,
    service: AuthService = Depends(get_auth_service)
):
    return await service.signup(
        email=user_in.email,
        password=user_in.password,
        full_name=user_in.full_name or "",
        role=user_in.role
    )

@router.post("/login", response_model=TokenDTO)
async def login_route(
    login_data: LoginSchema,
    service: AuthService = Depends(get_auth_service)
):
    return await service.login(email=login_data.email, password=login_data.password)

# Form login support (so Swagger OpenAPI login button works)
@router.post("/login/oauth2", response_model=TokenDTO)
async def login_oauth2_route(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service)
):
    return await service.login(email=form_data.username, password=form_data.password)

@router.get("/me", response_model=UserDTO)
async def get_me_route(current_user: UserDTO = Depends(get_current_user)):
    return current_user
