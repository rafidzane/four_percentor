## ADDED Requirements

### Requirement: Internal Docker port exposure
The system SHALL expose only port 3000 (Next.js) externally while FastAPI runs on port 8000 internally.

#### Scenario: External access restriction
- **WHEN** external client attempts to access the backend directly
- **THEN** connection is denied as port 8000 is not exposed

### Requirement: Internal API communication
The system SHALL allow internal communication between Next.js and FastAPI services on port 8000.

#### Scenario: Internal service communication
- **WHEN** Next.js makes a request to `/api/users`
- **THEN** the request is forwarded internally to `http://localhost:8000/api/users`