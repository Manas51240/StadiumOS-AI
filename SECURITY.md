# Security Guidelines & Compliance (OWASP Top 10)

StadiumOS AI is designed with defensive coding practices, adhering to OWASP Top 10 security standards.

---

## 🔒 Security Architectures & Controls

### 1. Authentication & Session Management (A01:2021 - Broken Access Control)
*   **JWT Authentication**: Implements stateless JSON Web Tokens using standard HMAC SHA-256 (`HS256`) algorithms. Access tokens expire dynamically according to the `ACCESS_TOKEN_EXPIRE_MINUTES` configuration.
*   **Password Hashing**: Uses `bcrypt` with automatic salting. Protects against bcrypt's internal 72-byte limit by truncating password byte streams at 72 bytes, preventing potential hashing buffer exceptions.

### 2. Authorization & RBAC (A01:2021 - Broken Access Control)
*   **Role-Based Access Control**: Enforces four strict roles: `spectator`, `volunteer`, `security`, and `organizer`.
*   Endpoints utilize FastAPI dependency injection (`Depends(get_current_active_user)`) to query user state and throw a `403 Forbidden` exception if the role is insufficient.

### 3. Injection Prevention (A03:2021 - Injection)
*   **SQL Injection**: Utilizes SQLAlchemy ORM's parameterized query compile layer for all database transactions, preventing SQL interpolation attacks.
*   **Prompt Injection**: Upgraded the AI Assistant service with standard regex filtering to block keywords/jailbreak phrases (e.g. `ignore all previous instructions`, `jailbreak`, etc.).
*   **XSS Mitigation**: Configures standard response headers (`X-XSS-Protection: 1; mode=block` and `Content-Security-Policy: default-src 'self'`) to block inline script injection.

### 4. API Rate Limiting & Denial of Service
*   **Rate Limiting Middleware**: Tracks requests per client IP address. Exceeding 60 requests per minute triggers an immediate `429 Too Many Requests` JSON response, protecting backend endpoints.

### 5. Sensitive Data Exposure (A02:2021 - Cryptographic Failures)
*   **Secrets Configuration**: Database credentials, token secrets, and external AI API keys are loaded via Pydantic settings from system environment variables (`.env`). Default fallback strings are blocked in production environments.
*   **Secure Response Headers**: Registers a global `SecurityHeadersMiddleware` enforcing:
    *   `X-Frame-Options: DENY` (anti-clickjacking)
    *   `X-Content-Type-Options: nosniff` (anti-mime sniffing)
    *   `Strict-Transport-Security: max-age=31536000` (HSTS parameter)
    *   `Referrer-Policy: strict-origin-when-cross-origin`
