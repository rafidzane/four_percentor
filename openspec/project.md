# Project Context

## Purpose
[Describe your project's purpose and goals]

## Tech Stack
- [List your primary technologies]
- [e.g., TypeScript, React, Node.js]

## Project Conventions

### Code Style
[Describe your code style preferences, formatting rules, and naming conventions]

## OpenSpec Rules

These rules are enforced by the OpenSpec framework and must be followed in all change proposals, tasks, and implementations.

### Cross-Platform Development

This tool runs on macOS, Linux, AND Windows. Always follow these guidelines:

- **Path handling**: Always use `path.join()` or `path.resolve()` for file paths—never hardcode slashes
- **Never assume forward-slash path separators** (Windows uses backslashes)
- **Tests must use `path.join()`** for expected path values, not hardcoded strings
- **Consider case sensitivity differences** in file systems (macOS can be case-insensitive)

### Artifact Generation

When generating artifacts:

- **Use explicit list lookups**, not pattern matching or regex
- **If we generate it, track it by name in a constant**
- Never rely on file patterns to identify generated files—maintain explicit lists

### Implementation Guidelines

- **Be explicit about mechanisms, not just outcomes** (say HOW, not just WHAT)
- Prefer Node.js path module over string manipulation for paths
- Use existing constants and lists instead of inventing new detection mechanisms
- If we generate it, we track it by name in a constant

## Project Documentation

## Overview
This project is a full-stack application built with Python (backend) and React (frontend). The system provides [brief description of what your app does].

## Architecture

### Backend (Python)
- **Framework**: [e.g., FastAPI, Django, Flask]
- **Database**: [e.g., PostgreSQL, MySQL, SQLite]
- **Authentication**: [e.g., JWT, OAuth2, Session-based]
- **API Documentation**: [e.g., Swagger/OpenAPI]

### Frontend (React)
- **Framework**: React 18+
- **State Management**: [e.g., Redux, Context API]
- **Styling**: [e.g., CSS Modules, Styled Components, Tailwind CSS]
- **Build Tool**: [e.g., Vite, Create React App]
- **Routing**: React Router

## Project Structure

```
project/
├── backend/                 # Python backend
│   ├── app/                 # Main application code
│   │   ├── api/             # API routes and endpoints
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic models for data validation
│   │   ├── database/        # Database connection and setup
│   │   └── main.py          # Entry point
│   ├── tests/               # Unit and integration tests
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # Backend specific documentation
│
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Context providers
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application component
│   ├── package.json         # Frontend dependencies and scripts
│   └── README.md            # Frontend specific documentation
│
├── docs/                    # Project documentation
├── .gitignore               # Git ignore rules
└── project.md               # This file
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or your chosen database)
- Docker (optional, for containerization)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Update with your configuration
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Update with your configuration
npm run dev
```

## Development Workflow

1. **Backend Development**
   - Create new API endpoints in `app/api/`
   - Define models in `app/models/`
   - Add tests in `tests/`
   - Run tests with `pytest`

2. **Frontend Development**
   - Create new components in `src/components/`
   - Add new pages in `src/pages/`
   - Update API services in `src/services/`
   - Run development server with `npm run dev`

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Deployment

### Backend Deployment
- [Deployment instructions for your chosen platform]
- Environment variables configuration
- Database migration scripts

### Frontend Deployment
- Build with `npm run build`
- Deploy to [e.g., Netlify, Vercel, AWS S3]

## API Documentation

API endpoints are documented using [Swagger/OpenAPI]. Access at:
- Development: `http://localhost:8000/docs`
- Production: `/docs`

## Environment Variables

### Backend
```
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Frontend
```
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[License information]

## Contact

[Contact information]

### Architecture Patterns
[Document your architectural decisions and patterns]

### Testing Strategy
[Explain your testing approach and requirements]

### Git Workflow
[Describe your branching strategy and commit conventions]

## Domain Context
[Add domain-specific knowledge that AI assistants need to understand]

## Important Constraints
[List any technical, business, or regulatory constraints]

## External Dependencies
[Document key external services, APIs, or systems]