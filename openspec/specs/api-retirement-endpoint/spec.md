## ADDED Requirements

### Requirement: Retirement API Endpoint Accessibility
The system SHALL provide a RESTful API endpoint at `/fourpercent/api/v4/retirement` that accepts retirement calculation requests.

#### Scenario: Successful retirement calculation request
- **WHEN** a client sends a POST request to `/fourpercent/api/v4/retirement` with valid retirement input data
- **THEN** the system returns a retirement projection response with calculated results

#### Scenario: Invalid input data
- **WHEN** a client sends a POST request to `/fourpercent/api/v4/retirement` with invalid retirement input data
- **THEN** the system returns an HTTP 400 error with details about validation errors

### Requirement: Retirement API Health Check
The system SHALL provide a health check endpoint at `/fourpercent/api/v4/retirement/health` to verify service availability.

#### Scenario: Health check endpoint access
- **WHEN** a client sends a GET request to `/fourpercent/api/v4/retirement/health`
- **THEN** the system returns a JSON response with status "ok"

## MODIFIED Requirements

### Requirement: Retirement API Endpoint Routing
The system SHALL properly route requests to the retirement calculation endpoint.

#### Scenario: Endpoint routing verification
- **WHEN** a request is made to `/fourpercent/api/v4/retirement`
- **THEN** the system routes the request to the retirement calculation service and returns appropriate response