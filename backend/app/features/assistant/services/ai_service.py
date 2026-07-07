import re
import json
import logging
import datetime
from typing import Dict, List, Tuple, Optional, Any
import google.generativeai as genai

from app.core.config import settings
from app.core.exceptions.exceptions import ValidationError
from app.features.assistant.presentation.schemas import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

# Memory state
_chat_memory: Dict[str, List[Dict[str, str]]] = {}

INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"system\s+prompt",
    r"you\s+are\s+now\s+a",
    r"bypass\s+restrictions",
    r"ignore\s+above",
    r"developer\s+mode",
    r"override\s+role",
    r"jailbreak",
]

SYSTEM_PROMPTS = {
    "spectator": (
        "You are the StadiumOS AI Spectator Operations Engine. Your task is to process spectator queries "
        "and return a valid JSON object matching the requested schema. Provide guidance on seating, gates, "
        "restrooms, concession stands, and accessibility options (elevators, ramps). Ensure steps-free routes "
        "are recommended for accessibility queries."
    ),
    "volunteer": (
        "You are the StadiumOS AI Volunteer Operations Engine. Process queries regarding shift timetables, "
        "logistics, and sector checkpoints. Route tasks to appropriate sectors and return a valid JSON object."
    ),
    "security": (
        "You are the StadiumOS AI Emergency Operations Engine. Handle queries regarding evacuation plans, "
        "hazards, first aid stations, and safety incidents. Prioritize clear, safety-first guidelines."
    ),
    "organizer": (
        "You are the StadiumOS AI Organizer Operations Engine. Analyze high-level metrics, sustainability data, "
        "attendance figures, and reports. Provide structured summaries."
    ),
}

KNOWLEDGE_BASE = {
    "gates": {
        "text": "Gates open 3 hours prior to kickoff. Accessibility entrance is Gate D. Use Gate A/B/C for general admissions.",
        "intent": "navigation",
        "tool": "get_gate_info",
        "args": {"accessibility_gate": "Gate D"},
    },
    "routes": {
        "text": "Accessibility route active. Take Elevator 3 located in Sector North to access Level 2. Do not use Escalator 1.",
        "intent": "navigation",
        "tool": "get_accessibility_path",
        "args": {"elevator": "Elevator 3", "sector": "North"},
    },
    "emergency": {
        "text": "Emergency evacuation active. Guide spectators to Exits 1-12 located on all lower concourse stand sectors.",
        "intent": "emergency",
        "tool": "trigger_evacuation_routing",
        "args": {"exits": "Exits 1-12"},
    },
    "sustainability": {
        "text": "Sustainability report: MetLife stadium utilizes 100% LED fixtures, zero-waste composting bins, and rainwater pitch harvesting.",
        "intent": "sustainability",
        "tool": "get_sustainability_metrics",
        "args": {"metrics": ["LED", "composting", "rainwater"]},
    },
    "volunteer": {
        "text": "Volunteer protocol: Briefings occur at the Volunteer Hub in Sector West Level 1. Uniform: green tournament kit.",
        "intent": "volunteer",
        "tool": "get_volunteer_briefing",
        "args": {"location": "Sector West, Level 1"},
    },
    "capacity": {
        "text": "Stadium stats: MetLife capacity for FIFA 2026 is 82,500. Expected attendance load is 98% (80,850).",
        "intent": "general",
        "tool": "get_capacity_stats",
        "args": {"capacity": 82500, "expected": 80850},
    },
}


class AIService:
    def __init__(self):
        self.api_key_valid = False
        if (
            settings.GEMINI_API_KEY
            and settings.GEMINI_API_KEY != "mock-key-for-stadium-os"
        ):
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.api_key_valid = True
                logger.info("Gemini API configured successfully in Operations Engine.")
            except Exception as e:
                logger.warning(f"Failed to config Gemini: {e}. Fallback active.")
        else:
            logger.info("Local fallback AI engine active.")

    def _detect_prompt_injection(self, text: str) -> bool:
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    def _get_conversation_history(self, conversation_id: str) -> List[Dict[str, str]]:
        if not conversation_id:
            return []
        if conversation_id not in _chat_memory:
            _chat_memory[conversation_id] = []
        return _chat_memory[conversation_id]

    def _save_conversation(self, conversation_id: str, role: str, content: str):
        if not conversation_id:
            return
        if conversation_id not in _chat_memory:
            _chat_memory[conversation_id] = []
        _chat_memory[conversation_id].append({"role": role, "content": content})
        if len(_chat_memory[conversation_id]) > 10:
            _chat_memory[conversation_id] = _chat_memory[conversation_id][-10:]

    def _classify_intent(self, message: str) -> str:
        msg_lower = message.lower()
        if (
            "gate" in msg_lower
            or "entrance" in msg_lower
            or "where is" in msg_lower
            or "elevator" in msg_lower
            or "waypoint" in msg_lower
        ):
            return "navigation"
        if (
            "emergency" in msg_lower
            or "evacuate" in msg_lower
            or "fire" in msg_lower
            or "hazard" in msg_lower
            or "danger" in msg_lower
        ):
            return "emergency"
        if (
            "volunteer" in msg_lower
            or "shift" in msg_lower
            or "duty" in msg_lower
            or "checklist" in msg_lower
        ):
            return "volunteer"
        if (
            "sustainability" in msg_lower
            or "recycle" in msg_lower
            or "energy" in msg_lower
            or "carbon" in msg_lower
        ):
            return "sustainability"
        return "general"

    def _generate_fallback_json(self, message: str, role: str) -> Dict[str, Any]:
        msg_lower = message.lower()
        intent = self._classify_intent(message)

        reply = f"StadiumOS Operations Engine ({role} mode): Processed input query successfully."
        tool_calls = []
        suggested_actions = []
        confidence = 0.80

        if "gate" in msg_lower or "entrance" in msg_lower:
            reply = KNOWLEDGE_BASE["gates"]["text"]
            tool_calls = [
                {
                    "function_name": KNOWLEDGE_BASE["gates"]["tool"],
                    "arguments": KNOWLEDGE_BASE["gates"]["args"],
                }
            ]
            suggested_actions = ["Locate Gate D", "View Map"]
            confidence = 0.95
        elif (
            "wheelchair" in msg_lower
            or "accessibility" in msg_lower
            or "elevator" in msg_lower
        ):
            reply = KNOWLEDGE_BASE["routes"]["text"]
            tool_calls = [
                {
                    "function_name": KNOWLEDGE_BASE["routes"]["tool"],
                    "arguments": KNOWLEDGE_BASE["routes"]["args"],
                }
            ]
            suggested_actions = ["Request Escalator Assistance", "Open Navigation Path"]
            confidence = 0.95
        elif "emergency" in msg_lower or "evacuate" in msg_lower:
            reply = KNOWLEDGE_BASE["emergency"]["text"]
            tool_calls = [
                {
                    "function_name": KNOWLEDGE_BASE["emergency"]["tool"],
                    "arguments": KNOWLEDGE_BASE["emergency"]["args"],
                }
            ]
            suggested_actions = ["Show Evacuation Exit", "Contact Dispatcher"]
            confidence = 0.98
        elif (
            "sustainability" in msg_lower
            or "carbon" in msg_lower
            or "recycle" in msg_lower
        ):
            reply = KNOWLEDGE_BASE["sustainability"]["text"]
            tool_calls = [
                {
                    "function_name": KNOWLEDGE_BASE["sustainability"]["tool"],
                    "arguments": KNOWLEDGE_BASE["sustainability"]["args"],
                }
            ]
            suggested_actions = ["Show Carbon Summary", "Recycling Guide"]
            confidence = 0.90
        elif "volunteer" in msg_lower or "shift" in msg_lower:
            reply = KNOWLEDGE_BASE["volunteer"]["text"]
            tool_calls = [
                {
                    "function_name": KNOWLEDGE_BASE["volunteer"]["tool"],
                    "arguments": KNOWLEDGE_BASE["volunteer"]["args"],
                }
            ]
            suggested_actions = ["Check Volunteer Tasks", "Shift Roster"]
            confidence = 0.92
        elif "capacity" in msg_lower or "attendance" in msg_lower:
            reply = KNOWLEDGE_BASE["capacity"]["text"]
            tool_calls = [
                {
                    "function_name": KNOWLEDGE_BASE["capacity"]["tool"],
                    "arguments": KNOWLEDGE_BASE["capacity"]["args"],
                }
            ]
            suggested_actions = ["View Sector Congestion", "Refresh Stats"]
            confidence = 0.90
        else:
            # Default response
            tool_calls = [
                {
                    "function_name": "process_general_query",
                    "arguments": {"query": message},
                }
            ]
            suggested_actions = ["Ask Operations Desk", "Read Stadium FAQs"]

        return {
            "reply": reply,
            "language": "en",
            "confidence_score": confidence,
            "intent": intent,
            "tool_calls": tool_calls,
            "suggested_actions": suggested_actions,
            "flagged": False,
            "flag_reason": None,
        }

    async def get_chat_response(self, request: ChatRequest) -> ChatResponse:
        # Request validation
        if not request.message or not request.message.strip():
            return ChatResponse(
                reply="Empty query received. Please ask a valid question.",
                language=request.language or "en",
                confidence_score=0.0,
                flagged=False,
            )

        if self._detect_prompt_injection(request.message):
            logger.warning(f"Blocked potential prompt injection: {request.message}")
            return ChatResponse(
                reply="Security alert: The query contains phrases violating platform security constraints. Request blocked.",
                language=request.language or "en",
                confidence_score=0.0,
                flagged=True,
                flag_reason="Potential prompt injection attempt.",
                suggested_actions=[
                    "Rephrase the question",
                    "Contact operations desk if this is a mistake",
                ],
            )

        history = self._get_conversation_history(request.conversation_id)
        system_instruction = SYSTEM_PROMPTS.get(
            request.user_role, SYSTEM_PROMPTS["spectator"]
        )

        # Enforce structured JSON schema prompts
        schema_instruction = (
            "\nOutput must be a valid JSON object matching the following fields exactly, with no additional text or formatting:\n"
            "{\n"
            '  "reply": "Clear, direct, explainable user-facing reply string.",\n'
            '  "language": "ISO language code (e.g. en, es, fr)",\n'
            '  "confidence_score": 0.95,\n'
            '  "intent": "Detected intent (e.g. navigation, volunteer, emergency, sustainability, general)",\n'
            '  "tool_calls": [{"function_name": "function_to_call", "arguments": {"arg_key": "val"}}],\n'
            '  "suggested_actions": ["Action Button 1", "Action Button 2"],\n'
            '  "flagged": false,\n'
            '  "flag_reason": null\n'
            "}"
        )

        prompt_with_context = f"System: {system_instruction}{schema_instruction}\n"
        for h in history:
            prompt_with_context += f"{h['role'].capitalize()}: {h['content']}\n"
        prompt_with_context += f"User: {request.message}\nAssistant:"

        response_data = None

        if self.api_key_valid:
            try:
                # Require JSON format from Gemini
                model = genai.GenerativeModel("gemini-1.5-flash")
                generation_config = genai.GenerationConfig(
                    response_mime_type="application/json"
                )
                response = model.generate_content(
                    prompt_with_context, generation_config=generation_config
                )
                if response and response.text:
                    parsed = json.loads(response.text.strip())
                    # Validate keys are present
                    if "reply" in parsed and "confidence_score" in parsed:
                        response_data = parsed
            except Exception as e:
                logger.error(f"Gemini LLM error: {e}. Executing fallback.")

        if response_data is None:
            # Rule fallback
            response_data = self._generate_fallback_json(
                request.message, request.user_role
            )

        if request.conversation_id:
            self._save_conversation(request.conversation_id, "user", request.message)
            self._save_conversation(
                request.conversation_id, "assistant", response_data["reply"]
            )

        return ChatResponse(
            reply=response_data["reply"],
            language=response_data.get("language", request.language or "en"),
            confidence_score=response_data.get("confidence_score", 0.90),
            flagged=response_data.get("flagged", False),
            flag_reason=response_data.get("flag_reason"),
            suggested_actions=response_data.get("suggested_actions", []),
            intent=response_data.get("intent", "general"),
            tool_calls=response_data.get("tool_calls", []),
        )

    async def generate_operational_report(
        self, report_type: str, stats: dict
    ) -> Tuple[str, float]:
        prompt = (
            f"Generate a professional, structured operational report for FIFA World Cup 2026.\n"
            f"Report Type: {report_type}\n"
            f"Input Stats: {stats}\n"
            f"Provide sections: 1. Executive Summary, 2. Key Operational Metrics, 3. Critical Anomalies/Incidents, "
            f"4. AI Optimization Recommendations."
        )

        if self.api_key_valid:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip(), 0.98
            except Exception as e:
                logger.error(f"Failed to generate report using Gemini: {e}")

        # Fallback operational report
        generated_time = (
            stats.get("generated_at")
            or datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
        fallback_report = f"""# StadiumOS AI Operational Report ({report_type.upper()})
Generated on: {generated_time}

## 1. Executive Summary
This report analyzes World Cup 2026 stadium operations. Operational efficiency was maintained at {stats.get('efficiency_rate', '96.4%')}. Crowd flows across primary sectors remained within safe capacity parameters.

## 2. Key Operational Metrics
- **Total Attendance**: {stats.get('attendance', 80850)} / 82500 ({stats.get('attendance_percent', '98.0%')})
- **Crowd Congestion Level**: {stats.get('congestion', 'Moderate')}
- **Active Volunteers**: {stats.get('active_volunteers', 420)}
- **Power Usage Efficiency**: {stats.get('power_saving_rate', '12% saving against baseline')}
- **Water Recycling Index**: {stats.get('water_index', '92%')}

## 3. Critical Anomalies & Incidents
- **Medical Emergencies**: {stats.get('medical_incidents', 2)} (All dispatched and resolved under 4 minutes)
- **Security Incidents**: {stats.get('security_incidents', 1)} (Controlled sector re-routing initiated)
- **Sustainability Anomaly**: Water consumption spike in Sector East concourse due to valve leakage. Rectified by maintenance crew.

## 4. AI Optimization Recommendations
1. **Dynamic Congestion Shifting**: Recommend early opening of Exit Gate 5 to balance egress loads.
2. **Volunteer Redistribution**: Reallocate 15 volunteers from concession stands to Gate D accessibility corridors post-match.
3. **Power Scaling**: Power down non-critical display systems in Sponsor lounges starting 45 minutes after match conclusion.
"""
        return fallback_report, 0.90


ai_service = AIService()
