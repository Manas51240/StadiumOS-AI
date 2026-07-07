from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.exceptions.exceptions import (
    DomainException,
    EntityNotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
)


async def domain_exception_handler(
    request: Request, exc: DomainException
) -> JSONResponse:
    status_code = 500
    if isinstance(exc, EntityNotFoundError):
        status_code = 404
    elif isinstance(exc, ValidationError):
        status_code = 400
    elif isinstance(exc, UnauthorizedError):
        status_code = 401
    elif isinstance(exc, ForbiddenError):
        status_code = 403
    elif isinstance(exc, ConflictError):
        status_code = 400

    return JSONResponse(status_code=status_code, content={"detail": exc.message})
