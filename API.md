# REST API Documentation

The StadiumOS AI backend provides a secure REST API exposed at `/api/v1/`.

---

## 🔒 Authentication

### 1. User Sign Up
*   **Endpoint**: `POST /api/v1/auth/signup`
*   **Request Body**:
    ```json
    {
      "username": "steward_john",
      "password": "securepassword123",
      "role": "security"
    }
    ```
*   **Response Body (200 OK)**:
    ```json
    {
      "id": 1,
      "username": "steward_john",
      "role": "security",
      "is_active": true
    }
    ```

### 2. User Login
*   **Endpoint**: `POST /api/v1/auth/login`
*   **Request Body (Form URL Encoded)**:
    - `username`
    - `password`
*   **Response Body (200 OK)**:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1Ni...",
      "token_type": "bearer"
    }
    ```

---

## 💬 AI Multilingual Assistant

### 1. Submit Chat Query
*   **Endpoint**: `POST /api/v1/assistant/chat`
*   **Request Headers**: `Authorization: Bearer <token>`
*   **Request Body**:
    ```json
    {
      "message": "Where is Elevator 3?",
      "language": "en",
      "conversation_id": "active-session-wc-2026",
      "user_role": "spectator"
    }
    ```
*   **Response Body (200 OK)**:
    ```json
    {
      "reply": "Accessibility route active. Take Elevator 3 located in Sector North to access Level 2.",
      "language": "en",
      "confidence_score": 0.95,
      "flagged": false,
      "flag_reason": null,
      "suggested_actions": ["Request Escalator Assistance", "Open Navigation Path"],
      "intent": "navigation",
      "tool_calls": [
        {
          "function_name": "get_accessibility_path",
          "arguments": {"elevator": "Elevator 3", "sector": "North"}
        }
      ]
    }
    ```
