# Changelog

All notable changes to the StadiumOS AI project are documented in this file.

## [1.0.0] - 2026-07-07

### Added
- **Backend Architecture**: FastAPI asynchronous SQLite backend, config handlers, JWT auth, and RBAC decorator hooks.
- **AI Service Layer**: LLM wrapper using Gemini SDK with keyword-based prompt injection shielding, context message memory, confidence calculations, and realistic mock fallbacks.
- **Frontend App**: Next.js App Router, global HSL styles themes (dark & high-contrast modes), accessibility context, and live ARIA announcements (WCAG 2.2 compliant).
- **Interactive Map**: SVG stadium maps representing sectors, nodes, waypoint routes, and congestion bypasses.
- **Operations Hubs**: Organizer dashboard command center, AI report compilers, emergency dispatches, and volunteer checklists.
- **DevOps Integrations**: Multi-stage Docker files, root orchestration `docker-compose.yml`, and GitHub Actions workflow checking formats and running tests.
- **Testing Suites**: Pytest test suites (>=90% coverage) and Jest testing layouts.
