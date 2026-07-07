class DomainException(Exception):
    """Base exception for all core business domain errors."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class EntityNotFoundError(DomainException):
    """Raised when a requested database or domain entity is missing."""

    pass


class ValidationError(DomainException):
    """Raised when validation constraints fail (e.g. prompt injection, invalid ranges)."""

    pass


class UnauthorizedError(DomainException):
    """Raised when authentication credentials are missing or invalid."""

    pass


class ForbiddenError(DomainException):
    """Raised when role authorization constraints fail."""

    pass


class ConflictError(DomainException):
    """Raised when business constraints clash (e.g. duplicate user registration)."""

    pass
