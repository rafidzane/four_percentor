## ADDED Requirements

### Requirement: API proxy configuration for Next.js
The system SHALL configure Next.js to route all `/api/*` requests through internal rewrites to the FastAPI backend running on `localhost:8000`.

#### Scenario: Successful API request routing
- **WHEN** frontend makes a request to `/api/users`
- **THEN** Next.js proxy forwards the request to `http://localhost:8000/api/users` internally

### Requirement: Docker networking configuration
The system SHALL configure Docker networking so that only port 3000 (Next.js) is exposed externally while FastAPI runs on port 8000 internally.

#### Scenario: Secure external access
- **WHEN** external client accesses the application
- **THEN** only port 3000 is accessible from outside the container