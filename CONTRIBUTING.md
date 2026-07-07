# Contributing to StadiumOS AI

We welcome contributions to StadiumOS AI! This document outlines coding standards, git branch workflows, and submission guidelines for developers.

## Code Standards
- **Backend (Python)**:
  - Follow PEP 8 guidelines.
  - Run `black app` for formatting and `flake8 app` for syntax and style check.
  - Maintain type annotations on all endpoints, models, and services.
- **Frontend (Next.js & TypeScript)**:
  - Adhere to semantic HTML5 structure.
  - Keep styling inside global styles or modular `.module.css` structures.
  - Ensure all components are keyboard navigable and ARIA label compliant (WCAG 2.2).

## Branch & Pull Request Flow
1. Fork the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
2. Commit your modifications with descriptive logs.
3. Write unit and integration tests covering your additions (targeting >= 90% coverage).
4. Run testing verification suites:
   - Backend: `pytest --cov=app`
   - Frontend: `npm test`
5. Submit a detailed Pull Request explaining the enhancements.
