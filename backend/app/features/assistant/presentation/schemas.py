from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    language: Optional[str] = "en"
    conversation_id: Optional[str] = None
    user_role: Optional[str] = "spectator"


class ChatResponse(BaseModel):
    reply: str
    language: str
    confidence_score: float
    flagged: bool = False
    flag_reason: Optional[str] = None
    suggested_actions: Optional[List[str]] = []
    intent: Optional[str] = "general"
    tool_calls: Optional[List[Dict[str, Any]]] = []
