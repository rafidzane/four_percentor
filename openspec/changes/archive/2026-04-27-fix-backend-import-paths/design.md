## Context

The backend Python codebase uses relative import paths starting with "from ." which causes issues when the application is run in different environments. This change addresses the root cause by converting these relative imports to absolute imports that start with "from fourpercent". 

This is a straightforward refactoring task that affects all Python modules in the backend structure, ensuring consistent and predictable module resolution.

## Goals / Non-Goals

**Goals:**
- Convert all relative import paths in backend Python files to absolute paths
- Ensure all imports use the correct "from fourpercent" prefix
- Maintain identical functionality while fixing path resolution issues
- Keep changes minimal and focused on import statements only

**Non-Goals:**
- Change any business logic or functionality
- Modify API endpoints or their behavior
- Introduce new features or capabilities
- Affect frontend code or configuration

## Decisions

1. **Import Style**: Changed all relative imports (e.g., `from .models.root`) to absolute imports (e.g., `from fourpercent.models.root`) to ensure proper module resolution in all environments.

2. **Scope**: The change applies to all Python files in the backend directory structure, including routers, services, models, schemas, and dependencies.

3. **Consistency**: Maintained consistent import patterns throughout the codebase by standardizing on absolute paths.

4. **Backward Compatibility**: This change doesn't break existing functionality but fixes deployment issues.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Import errors in production environments | Thorough testing in staging environment before deployment |
| Missing imports in some files | Comprehensive code review to ensure all files are updated |
| Potential circular import issues | Review and test all import chains after changes |