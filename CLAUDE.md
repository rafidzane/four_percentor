# FourPercentor - Retirement Planning Dashboard

A full-stack retirement planning application with a Next.js frontend and FastAPI backend.

## Development Process

This project follows the **OpenSpec** workflow for tracking changes. Before implementation:

1. Run `/opsx:propose <change-name>` to create proposal, design, specs, and tasks
2. Review artifacts in `openspec/changes/<change-name>/`
3. Only after all artifacts are complete, run `/opsx:apply`

See `project.md` for full guidelines.

## Project Structure

```
four_percentor/
├── frontend/          # Next.js 16 React app (Studio Admin)
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/ # Shared UI components
│   │   ├── lib/       # Utility functions & clients
│   │   ├── stores/    # Zustand state management
│   │   └── config/    # Configuration files
│   └── package.json
├── backend/           # FastAPI Python backend
│   └── fourpercent/
│       ├── api/       # API endpoints
│       ├── calculation/ # Retirement calculation logic
│       └── models/    # Pydantic models
└── tests/             # Test files

```

## Tech Stack

**Frontend:**
- Next.js 16 (App Router, Server Components)
- React 19.2
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Zustand for state management
- TanStack Query for data fetching
- Radix UI primitives

**Backend:**
- FastAPI
- Pydantic
- Uvicorn

## Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn fourpercent.main:app --reload
```

## Key Features

- Retirement calculation engine
- Multi-step user input forms
- Interactive dashboard with charts (Recharts, Chart.js)
- Dark/light theme support
- Responsive layout with sidebar navigation
- Authentication system (v1 & v2)

## Development Notes

- Biome used for linting and formatting
- Husky pre-commit hooks enabled
- Theme preferences persisted via Zustand store
- View transitions and animations using React 19 features
