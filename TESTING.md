# Automated Testing Framework & Guidelines

StadiumOS AI implements a comprehensive testing suite enforcing strict test-driven development (TDD) and clean code validation.

---

## 🧪 Testing Infrastructure

### 1. Backend Testing Suite (`backend/app/tests/`)
*   **Framework**: `pytest` and `pytest-asyncio`.
*   **Database Fixture**: Uses an in-memory SQLite engine (`sqlite+aiosqlite:///:memory:`) configured in [conftest.py](file:///e:/Challenge%204/backend/app/tests/conftest.py), ensuring database state isolation per test function.
*   **Mocks**: Includes simulated external service modules (e.g. Gemini LLM configurations) to test fallback response layers.
*   **Test Cases**:
    *   **Unit Tests**: Standard model mappings and validations in [test_unit.py](file:///e:/Challenge%204/backend/app/tests/test_unit.py).
    *   **API Tests**: Fast HTTP routing, status verification, and token authentication logic validation in [test_api.py](file:///e:/Challenge%204/backend/app/tests/test_api.py).

#### Running Backend Tests
Execute within the `/backend` folder:
```bash
# Run all tests
python -m pytest

# Run tests with code coverage metrics
python -m pytest --cov=app --cov-report=term-missing
```

---

### 2. Frontend Testing Suite (`frontend/src/__tests__/`)
*   **Framework**: `jest` and `@testing-library/react`.
*   **Mocks**: Mocks Next.js routing structures (`next/navigation`), layout auth hooks (`useAuth`), and accessibility contexts (`useAccessibility`).
*   **Test Cases**:
    *   **Component Rendering Tests**: Verifies page layouts compile and render clean HTML landmarks.
    *   **Accessibility Tests**: Confirms focus management and boundary handles function.

#### Running Frontend Tests
Execute within the `/frontend` folder:
```bash
# Run all Jest tests
npm test
```

---

## 🛠️ GitHub Actions Continuous Integration (CI)
Our tests run automatically on every push or pull request to the `main` or `master` branch. The CI workflow is configured in [.github/workflows/ci.yml](file:///e:/Challenge%204/.github/workflows/ci.yml) and performs:
1. Python environment set up with standard packages installation.
2. Code style checks (using `black` and `flake8`).
3. Automated unit and integration tests with code coverage metrics.
4. Node environment setup and NPM package installations.
5. Frontend validation checks and Jest test runs.
