# Project Structure and Guidelines

## API Endpoints
All API endpoints should be implemented under `backend/fourpercent/api`

## Code Flow Architecture
The project follows a clear architectural flow:
1. **API Layer** - Handles HTTP requests and responses
2. **Service Layer** - Contains business logic 
3. **Data Access Layer** - Manages database operations

## Module Organization

### Models
All data models should be placed in the `models` module

### Utilities
Utility functions and helper methods should be organized under the `util` module

## Implementation Principles
- Maintain clear separation of concerns between layers
- Ensure all API endpoints properly validate input data
- Follow existing code patterns and conventions
- All database operations should go through the service layer

## OpenSpec Guidelines

### Change Management
- All changes should be tracked using OpenSpec workflow
- Each change should have a dedicated directory in `openspec/changes/`
- Changes should follow the spec-driven approach with proposal, design, specs, and tasks artifacts

### Artifact Requirements
- Every change must include: proposal.md, design.md, specs/**/*.md, and tasks.md
- Artifacts should be comprehensive and clearly explain what is being implemented
- Each artifact should be created before implementation begins

### Implementation Process
- Changes should be implemented in a staged manner using the tasks file
- Each task should be marked as complete when finished
- All changes must be tested and validated before marking tasks complete
- After all tasks are complete, changes can be archived using `/opsx:archive`

### Testing Requirements
- Unit tests should be written for all new functionality
- Integration tests should validate end-to-end workflows
- All existing tests must continue to pass after implementation

## Code Quality Standards
- All code should follow TypeScript/Python best practices
- Proper type definitions and validation should be used
- Documentation should be clear and comprehensive
- Code should be maintainable and readable