## Why

The backend Python files have incorrect relative import paths that start with "from ." instead of "from fourpercent". This causes import errors when the code is run outside of the local development environment, particularly when the application is deployed or tested in different contexts. These relative imports prevent proper module resolution and break the application's functionality in production environments.

## What Changes

- Fix all Python import statements in backend files to use absolute paths starting with "from fourpercent"
- Replace relative imports (e.g., `from .models.root`) with absolute imports (e.g., `from fourpercent.models.root`)
- Ensure consistent import patterns across all backend modules
- Maintain the same functionality while fixing path resolution issues

## Capabilities

### New Capabilities
- `backend-import-resolution`: Improved module resolution for backend Python code
- `absolute-imports`: Consistent use of absolute import paths throughout the backend

### Modified Capabilities
- `backend-codebase`: The overall structure and import patterns of the backend codebase have been updated to fix import path issues

## Impact

- **Backend**: All Python modules in the backend will have corrected import statements
- **Deployment**: Fixes issues when deploying the application to production environments
- **Testing**: Ensures tests run correctly in different contexts
- **Code Quality**: Improves maintainability by standardizing import patterns