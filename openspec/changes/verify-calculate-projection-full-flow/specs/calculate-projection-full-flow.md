## ADDED Requirements

### Requirement: Calculate Projection button triggers API call
When the user clicks the "Calculate Projection" button, the system must trigger a manual calculation that calls the backend retirement API.

#### Scenario: Button click initiates calculation
- **WHEN** user clicks the "Calculate Projection" button
- **THEN** the `calculateNow()` function from `useRetirementCalculation` hook is invoked
- **AND** the loading state shows "Calculating..." with spinner

#### Scenario: API endpoint receives correct request
- **WHEN** calculation is triggered
- **THEN** HTTP POST request is sent to `/fourpercent/api/v4/retirement`
- **AND** Content-Type header is set to `application/json`
- **AND** request body contains valid `FormData` structure

### Requirement: Form data is correctly serialized for API
All form inputs must be properly collected and sent to the backend without undefined or null values that aren't optional.

#### Scenario: Valid form data is sent
- **WHEN** all required fields have valid values
- **THEN** the cleaned request body excludes optional fields set to undefined/null
- **AND** numeric fields are sent as numbers (not strings)

### Requirement: Successful API response updates charts and results
When the backend returns simulation results, the frontend must update all visual components with the new data.

#### Scenario: Charts update with simulation results
- **WHEN** a successful `RetirementResponse` is received
- **THEN** portfolio balance chart renders new age/balance data points
- **AND** income vs expenses chart updates with new lines
- **AND** success rate display shows the computed value

#### Scenario: Numerical results update
- **WHEN** results are received
- **THEN** final balance, average balance, max/min balance display correctly
- **AND** all monetary values are formatted appropriately

### Requirement: Error handling displays user-friendly messages
If the API call fails or returns an error response, the system must show clear feedback to the user.

#### Scenario: Network failure handled gracefully
- **WHEN** backend server is unreachable (network error)
- **THEN** user sees "Failed to connect to the calculator" message
- **AND** retry button allows re-attempting the calculation

#### Scenario: API returns error response
- **WHEN** backend returns non-2xx status code
- **THEN** error banner displays with specific error detail from response
- **AND** user can retry the calculation after fixing any issues
