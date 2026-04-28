## ADDED Requirements

### Requirement: Retirement API Endpoint
The system SHALL provide a RESTful API endpoint at `/fourpercent/api/v4/retirement` that accepts retirement calculation requests with comprehensive input data and returns structured output.

#### Scenario: Valid retirement calculation request
- **WHEN** a client sends a POST request to `/fourpercent/api/v4/retirement` with valid retirement input data
- **THEN** the system processes the inputs and returns a retirement projection response

#### Scenario: Invalid input data validation
- **WHEN** a client sends a POST request to `/fourpercent/api/v4/retirement` with invalid retirement input data
- **THEN** the system returns an HTTP 400 error with details about validation errors

### Requirement: Retirement API Response Format
The system SHALL return structured retirement projection data in a consistent JSON format.

#### Scenario: Successful retirement calculation response
- **WHEN** a valid retirement calculation request is processed
- **THEN** the system returns a JSON response containing:
  - Age timeline
  - Portfolio balance projections
  - Income and expense timelines
  - Success metrics (success boolean, success probability)
  - Key statistics (final_balance, avg_balance, max_balance, min_balance)

### Requirement: Retirement API Health Check Endpoint
The system SHALL provide a health check endpoint at `/fourpercent/api/v4/retirement/health` to verify service availability.

#### Scenario: Health check endpoint access
- **WHEN** a client sends a GET request to `/fourpercent/api/v4/retirement/health`
- **THEN** the system returns a JSON response with status "ok"