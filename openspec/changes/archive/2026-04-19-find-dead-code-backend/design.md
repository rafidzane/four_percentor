## Context

The project has a Python-based backend with the following structure:
- Main entry point: `backend/main.py`
- Core module: `backend/fourpercent/`
  - `calculation/`: Business logic for calculations
  - `api/`: API endpoints and routing
  - `models/`: Data models
  - `main.py`: Application entry point
- Test files: `backend/test_retirement_api.py`, `tests/integration/test_deep_retirement_api.py`

The backend uses Python with standard libraries and appears to be a REST API service for retirement calculations.

## Goals / Non-Goals

**Goals:**
- Identify and report unused imports, functions, classes, and modules in the backend
- Detect dead code that is never called or referenced
- Provide actionable cleanup recommendations
- Establish a baseline for code quality metrics

**Non-Goals:**
- Frontend dead code detection (focus only on backend)
- Automated removal of dead code (manual review and cleanup only)
- Performance optimization (separate concern)
- Code style enforcement (separate concern)

## Decisions

**Tool Selection:**
- Use `pylint` for static analysis and dead code detection
  - Rationale: Well-established Python linter with dead code detection capabilities
  - Alternative considered: `flake8` (lacks dead code detection), `mypy` (type checking only)
  - Alternative considered: Custom analysis (too complex, reinvents the wheel)

**Analysis Scope:**
- Analyze all Python files in `backend/fourpercent/` and `backend/`
  - Rationale: Focus on actual backend code, exclude tests and dependencies
  - Alternative considered: Include all project files (too noisy, includes tests)

**Output Format:**
- Generate machine-readable JSON report for automation
- Generate human-readable markdown report for review
  - Rationale: Supports both automated processing and manual review

**Severity Classification:**
- Categorize dead code by impact: unused imports, unused functions, unused classes, unused modules
  - Rationale: Helps prioritize cleanup efforts

## Risks / Trade-offs

**Risk: False Positives** → Mitigation: Manual review of flagged code, use pylint's confidence levels

**Risk: Breaking Changes** → Mitigation: Verify code is truly unused before removal, maintain version control

**Trade-off: Analysis Time** → Static analysis is fast, but complex dependencies may cause false positives

**Trade-off: Coverage** → May miss dead code in dynamically imported modules or complex dependency chains