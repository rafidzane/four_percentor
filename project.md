# Project Documentation

## Project Overview

This section describes the purpose and goals of the project.

## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Chart.js

### Backend
- Python
- FastAPI
- PostgreSQL

### Tools
- Git
- Docker
- ESLint
- Prettier

## Project Structure

```
four_percentor/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── openspec/
│   ├── changes/
│   └── specs/
└── project.md
```

## Development Guidelines

### Code Style
- **Frontend**: Use TypeScript for all new code
- **Backend**: Use Python with type hints
- Follow existing code patterns and conventions
- Write clear, descriptive variable and function names
- Add comments for complex logic
- **Logging**: Keep logs on one line unless they exceed 180 characters. If a log message exceeds 180 characters, use a multiline f-string: `f"""..."""`

### Commit Messages
- Use conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Example: `feat(calculator): add retirement calculator component`

### Branch Naming
- Use kebab-case for branch names
- Feature branches: `feature/<name>`
- Bugfix branches: `bugfix/<name>`
- Example: `feature/retirement-calculator`

## Testing Requirements

### Unit Tests
- **Frontend**: Test all React components and hooks
- **Backend**: Test all Python functions and services
- Test all calculation functions
- Test all state management logic
- Test all input validation
- Maintain test coverage > 80%

### Integration Tests
- Test user flows
- Test component interactions
- Test scenario comparison

## Deployment

### Build Process
**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Environment Variables
- Create `.env` file for local development
- Use `.env.example` as template
- Never commit `.env` files

## Ignore Rules

OpenCode should skip reading files from the following directories to improve performance and reduce context window usage:

- `node_modules` - Third-party dependencies
- `.next` - Next.js build artifacts
- `.opencode/node_modules` - OpenCode's own dependencies
- `dist`, `build` - General build output directories

These directories contain generated files that are never needed for code review or implementation tasks.

## Project Rules

### Feature Development
1. Create OpenSpec change with proposal, design, specs, and tasks
2. Implement frontend tasks in frontend/src/
3. Implement backend tasks in backend/app/
4. Run tests before committing
5. Update documentation as needed

### Code Review
- All changes require code review
- Reviewers should verify implementation matches specs
- Comments and questions are encouraged

### Documentation
- Keep documentation up to date
- Document all assumptions and limitations
- Use clear, concise language

# OpenSpec Project Operating Instructions

## Core Execution Policy

1. Treat every request as a specification to be analyzed, decomposed, and executed in structured phases.
2. Convert ambiguous or large requests into clear objectives, assumptions, deliverables, and implementation steps.
3. Always optimize for task completion, continuity, and efficient context usage.
4. Prefer progress over perfection. Deliver working increments quickly, then refine.
5. Maintain momentum until the request is complete or a blocking dependency is identified.

---

## Automatic Task Decomposition

6. Before implementation, break work into logical units such as:
   - discovery
   - architecture
   - scaffolding
   - implementation
   - testing
   - refinement
   - documentation

7. For large requests, recursively split tasks into smaller actionable subtasks.
8. Resolve dependencies first.
9. Execute highest-value / highest-leverage tasks earliest.
10. If multiple valid paths exist, choose the simplest maintainable approach and proceed.

---

## Context Window Preservation

11. Never waste context on repetition.
12. Do not restate prior outputs unless necessary.
13. Summarize prior work compactly when continuing across steps.
14. Preserve only active working memory:
   - current objective
   - constraints
   - completed items
   - next actions
   - open decisions

15. When output may exceed limits, continue in phases rather than over-explaining.

---

## Multi-Step Delivery Rules

16. If a task is too large for one pass, automatically split delivery into:

### Phase Model
- Phase 1: Plan
- Phase 2: Structure
- Phase 3: Core Build
- Phase 4: Validation
- Phase 5: Polish
- Phase 6: Handoff

17. Clearly mark progress after each phase:
   - Completed
   - Current
   - Next

18. Continue sequentially until done.

---

## Code Generation Standards

19. Produce production-grade code unless told otherwise.
20. Prefer modular, readable, maintainable implementations.
21. Keep files focused and functions small.
22. Follow existing project conventions first.
23. Add comments only where they improve clarity.
24. Include tests for critical logic.
25. Include setup/run instructions when useful.

---

## File Generation Strategy

26. For large builds, generate file-by-file rather than one monolithic output.
27. Prefer patches / diffs / targeted edits over full rewrites.
28. Modify only impacted files unless refactor is justified.
29. Name files consistently with project conventions.

---

## Decision Policy

30. If requirements are incomplete, make reasonable assumptions and continue.
31. State assumptions briefly only when relevant.
32. Do not block progress for minor uncertainties.
33. Ask questions only when the missing information materially changes implementation.

---

## Spec-Driven Behavior

34. Convert user requests into:
   - Goal
   - Requirements
   - Constraints
   - Deliverables
   - Execution Plan

35. Track scope and prevent drift.
36. If scope expands, separate into:
   - current scope
   - future enhancements

---

## Large Project Handling

37. For enterprise-scale requests, create workstreams such as:
   - backend
   - frontend
   - data
   - infrastructure
  

38. Execute each stream incrementally.
39. Use checkpoints and summaries between streams.
40. Mark things complete as you finish them

---

## Output Style

40. Be concise, structured, and implementation-focused.
41. Prefer actionable output over theory.
42. Use bullets, checklists, tables, and sections when helpful.
43. Minimize filler text.

---

## Completion Standard

44. A request is complete only when the requested artifact is usable.
45. If partial completion is necessary, provide:
   - what is done
   - what remains
   - exact next step

## OpenSpec Workflow

### Creating Changes
1. Use `/opsx-propose` to create a new change
2. Complete all artifacts (proposal, design, specs, tasks)
3. Use `/opsx-apply` to implement the change
4. Use `/opsx-archive` to finalize the change

### Change Lifecycle
1. **Propose**: Create change with artifacts
2. **Apply**: Implement the change
3. **Archive**: Finalize and document the change

## Best Practices

### Performance
- **Frontend**: Optimize component re-renders, use memoization for expensive calculations, lazy load heavy components, implement proper error boundaries
- **Backend**: Optimize database queries, implement caching, use async/await for I/O operations

### Security
- **Frontend**: Validate all user inputs, sanitize all user-generated content, use environment variables for sensitive data, implement proper authentication/authorization
- **Backend**: Validate all user inputs, sanitize all user-generated content, use environment variables for sensitive data, implement proper authentication/authorization, use OWASP security best practices

### Accessibility
- Use semantic HTML
- Ensure keyboard navigation
- Provide proper ARIA labels
- Test with screen readers

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes in frontend/src/ or backend/app/
4. Submit a pull request

### Pull Request Process
1. Ensure all frontend and backend tests pass
2. Update documentation
3. Get code review
4. Address review comments
5. Merge to main branch

## License

[Add license information here]

## Contact

[Add contact information here]