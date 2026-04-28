# Project Guidelines

## OpenSpec Change Workflow

This project uses the **OpenSpec** workflow for tracking and implementing changes. Before any implementation begins, the following artifacts must be created:

1. **`proposal.md`** - What the change is and why it's needed
2. **`design.md`** - How the change will be implemented (architecture decisions)
3. **`specs/**/*.md`** - Detailed requirements with testable scenarios
4. **`tasks.md`** - Checklist of implementation tasks

### When to Use OpenSpec

Use `/opsx:propose` when:
- Adding new features or capabilities
- Modifying existing API endpoints or data models
- Changing UI layouts or user flows
- Any non-trivial change that benefits from planning

### Workflow

```bash
# Propose a new change
/opsx:propose <change-name>

# After artifacts are created, apply the change
/opsx:apply
```

### Location

All OpenSpec changes are stored in `openspec/changes/<change-name>/` with:
- `proposal.md` - Problem statement and impact
- `design.md` - Technical approach
- `specs/` - Detailed requirements per capability
- `tasks.md` - Implementation checklist

## Code Style

- Follow existing patterns in the codebase
- Use TypeScript for all new frontend components
- Type all API responses with Pydantic models
- Test-drive development where applicable
