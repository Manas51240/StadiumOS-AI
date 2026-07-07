from fastapi import APIRouter, Depends, HTTPException, status
from app.features.assistant.presentation.schemas import ChatRequest, ChatResponse
from app.features.auth.presentation.routes import get_current_user
from app.features.auth.services.dtos import UserDTO
from app.features.assistant.services.ai_service import ai_service

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant_route(
    request: ChatRequest, current_user: UserDTO = Depends(get_current_user)
):
    try:
        # Enforce authenticated user's role
        request.user_role = current_user.role
        return await ai_service.get_chat_response(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI assistant router error: {str(e)}",
        )
