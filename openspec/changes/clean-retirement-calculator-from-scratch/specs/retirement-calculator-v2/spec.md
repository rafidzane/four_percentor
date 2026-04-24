## ADDED Requirements

### Requirement: User can input retirement parameters

The system SHALL provide form fields for users to enter:
- Current age (18-100)
- Retirement age (must be > current age, ≤ 100)
- Liquid assets (≥ 0)
- Illiquid assets (≥ 0)
- Monthly contribution (≥ 0)
- Expected annual return rate (0-100%)
- Social Security age (62-70)
- Expected lifespan (> retirement age, ≤ 120)

#### Scenario: Valid inputs accepted
- **WHEN** user enters valid values within all ranges
- **THEN** system accepts inputs and proceeds to calculation

#### Scenario: Invalid current age rejected
- **WHEN** user enters age < 18 or > 100
- **THEN** system displays error message "Must be between 18 and 100"

#### Scenario: Invalid retirement age rejected  
- **WHEN** user enters retirement age ≤ current age or > 100
- **THEN** system displays appropriate error message

### Requirement: System calculates retirement projections

The system SHALL calculate and display:
- Years until retirement
- Total liquid savings at retirement (with compound interest)
- Total net worth at retirement (liquid + illiquid)
- Monthly income at retirement
- Social security benefit amount
- Safe annual withdrawal amount (4% rule)
- Withdrawal rate as percentage

#### Scenario: Calculation with valid inputs
- **WHEN** user submits form with valid parameters
- **THEN** system displays all calculated results in currency format

### Requirement: API integration

The system SHALL communicate with backend API at `/fourpercent/api/v2/deep_retirement`

#### Scenario: Successful API response
- **WHEN** API returns valid calculation data
- **THEN** system parses response and displays results

#### Scenario: API validation error (422)
- **WHEN** API responds with 422 status
- **THEN** system displays "Invalid input parameters. Please check your values"

### Requirement: Results display

The system SHALL present results in clear, organized sections:
- Net worth at retirement
- Liquid savings at retirement  
- Monthly income at retirement
- Social security benefit (monthly)
- Safe annual withdrawal amount
- Years until retirement

#### Scenario: Display formatted currency
- **WHEN** showing monetary values
- **THEN** values display as USD currency with no decimal places

### Requirement: Form validation

The system SHALL validate all inputs before calculation:
- Current age range check
- Retirement age relative to current age
- Social security age range check
- Lifespan relative to retirement age
- Asset values non-negative
- Contribution non-negative
- Return rate percentage range
- Total assets not zero

#### Scenario: Validation errors displayed
- **WHEN** user submits with invalid inputs
- **THEN** system highlights error fields and shows specific error messages

### Requirement: Loading states

The system SHALL indicate when calculation is in progress.

#### Scenario: Calculation loading
- **WHEN** API call is pending
- **THEN** system shows spinner and disables submit button

### Requirement: Error handling

The system SHALL handle and display errors gracefully.

#### Scenario: Server error (500)
- **WHEN** API returns 500 status
- **THEN** system displays "Server error. Please try again later."
