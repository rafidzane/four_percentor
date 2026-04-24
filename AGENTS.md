# Four Percentor Development Guide

## Quick Start

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn fourpercent.main:app --host 0.0.0.0 --port 8000 --reload
# Or use: ./run_dev.sh
```

## API Endpoints

**Backend runs on http://localhost:8000** with these mounted APIs:
- `/fourpercent/api/v1/retirement` - Basic retirement calculator
- `/fourpercent/api/v2/deep_retirement` - Advanced retirement planner (single person)
- `/fourpercent/api/v3/retirement` - Two-person retirement calculator

Frontend proxies these via `NEXT_PUBLIC_API_BASE_URL`.

## Development Commands

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run Biome linter
- `npm run format` - Format with Biome
- `npm run check` - Check without fixing
- `npm run check:fix` - Fix issues automatically
- `npx @biomejs/biome check --write` - Format and organize imports

### Backend
- `pip install -r requirements.txt` - Install dependencies
- `uvicorn fourpercent.main:app --host 0.0.0.0 --port 8000 --reload` - Run dev server
- `./run_dev.sh` - Alternative dev server script
- `pytest` - Run backend tests
- `python test_retirement_api.py` - Manual API test

### Testing
- **Backend**: `pytest` (unit & integration tests in `tests/`)
- **Frontend**: `npm test` or `vitest` (configured in `vitest.config.ts`)
- Test setup: `frontend/src/test/setup.ts`

## OpenSpec Workflow

This project uses OpenSpec for change management:

1. **Propose**: `/opsx-propose` - Create change with proposal, design, specs, tasks
2. **Apply**: `/opsx-apply` - Implement the change
3. **Archive**: `/opsx-archive` - Finalize and document the change

Artifacts live in `openspec/changes/<name>/`.

## Project Structure

**Frontend** (Next.js 16 + TypeScript + Tailwind v4):
```
frontend/
├── src/
│   ├── app/           # Next.js routes (App Router)
│   ├── components/    # Shared UI components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Config & utilities
│   ├── styles/        # Tailwind/theme setup
│   └── test/          # Test utilities
```

**Backend** (FastAPI + Python):
```
backend/
├── fourpercent/
│   ├── api/           # API endpoints
│   ├── calculation/   # Core calculation logic
│   └── models/        # Data models
├── main.py            # Mounts all APIs
└── run_dev.sh         # Dev server script
```

## Code Style

**Frontend**: TypeScript with strict typing. Use existing patterns and conventions.

**Backend**: Python with type hints. Follow existing code patterns.

**Formatting**: Biome (not ESLint/Prettier as mentioned in project.md). Configure in `frontend/biome.json`.

**Commit Messages**: Conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

**Branch Naming**: kebab-case (e.g., `feature/retirement-calculator`)

## Environment Variables

Frontend uses `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Never commit `.env` files.

## Important Notes

- Logging: Keep logs on one line unless exceeding 180 characters. Use multiline f-strings for longer logs
- Frontend uses colocation-based architecture (feature folders with pages, components, logic)
- Backend has three separate API apps mounted under different paths
- Use Husky pre-commit hooks (lint-staged) for code quality

## Ignore Rules

OpenCode should skip reading files from the following directories to improve performance and reduce context window usage:

- `node_modules` - Third-party dependencies
- `.next` - Next.js build artifacts
- `.opencode/node_modules` - OpenCode's own dependencies
- `dist`, `build` - General build output directories

These directories contain generated files that are never needed for code review or implementation tasks.