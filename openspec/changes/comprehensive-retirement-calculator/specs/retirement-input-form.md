## ADDED Requirements

### Requirement: Multi-section retirement input form
The system SHALL provide a comprehensive retirement planning form organized into logical sections that collect all necessary data for retirement projections.

#### Scenario: Form displays all required sections
- **WHEN** user navigates to `/dashboard/retirement`
- **THEN** the following sections are visible:
  - Personal Information (current age, retirement age, spouse age)
  - Portfolio (401k, IRA, taxable brokerage, cash)
  - Contributions (yearly amount, growth rate, catch-up eligibility)
  - Returns (mode selector, pre/post returns, inflation)
  - Withdrawal Strategy (4% rule or manual, spending mode)
  - Income Sources (Social Security, pensions, rentals)
  - Expenses (essential vs discretionary splits)
  - Real Estate (property values, equity)

### Requirement: Personal Information Section
The system SHALL collect personal demographics including current age, retirement age, and optional spouse information.

#### Scenario: User enters valid ages
- **WHEN** user inputs:
  - Current age between 18-100
  - Retirement age > current age
  - Optional spouse age (same range)
- **THEN** values are accepted without error

### Requirement: Portfolio Section
The system SHALL collect asset breakdown by account type.

#### Scenario: User enters portfolio allocation
- **WHEN** user inputs:
  - Investment portfolio balance
  - Your 401(k)/IRA balance
  - Spouse 401(k)/IRA balance
  - Total asset value
- **THEN** form accepts values and stores for calculation

### Requirement: Contributions Section
The system SHALL collect yearly contribution data with growth parameters.

#### Scenario: User enters contributions with growth
- **WHEN** user inputs:
  - Yearly contribution amount (>=0)
  - Yearly contribution increase percentage (0-100%)
  - Catch-up eligible toggle
- **THEN** form stores all values for calculation engine

### Requirement: Returns Section
The system SHALL collect portfolio return assumptions and simulation mode.

#### Scenario: User selects historical mode
- **WHEN** user selects "historical (S&P since 1871)" as mode
- **THEN** historical data is used for projections without manual input

#### Scenario: User selects manual mode
- **WHEN** user selects "manual" mode
- **THEN** user can input:
  - Pre-retirement equity return %
  - Post-retirement equity return %
  - Fixed income return %
  - Inflation %

### Requirement: Withdrawal Strategy Section
The system SHALL collect spending strategy preferences.

#### Scenario: User selects 4% rule
- **WHEN** user selects "4% rule" as spending mode
- **THEN** first year withdrawal is automatically calculated as 4% of portfolio balance

#### Scenario: User selects manual withdrawal
- **WHEN** user selects "manual_withdrawal" mode
- **THEN** user must input:
  - First year expenses (today's dollars)
  - Withdrawal percentage
  - Age range start/end
  - Inflation adjustment toggle

### Requirement: Income Sources Section
The system SHALL collect all income stream information.

#### Scenario: User enters Social Security data
- **WHEN** user inputs:
  - Claim age (62-70)
  - Yearly amount in today's dollars
  - COLA adjustment method (inflation/fixed)
- **THEN** form stores for projection calculations

### Requirement: Real Estate Section
The system SHALL collect property information.

#### Scenario: User enters property data
- **WHEN** user inputs:
  - Total property value
  - Outstanding mortgage(s)
  - Annual appreciation %
  - Include in net worth toggle
- **THEN** form stores values for calculation

### Requirement: Form Validation
The system SHALL validate all inputs before submission.

#### Scenario: User submits invalid data
- **WHEN** user submits with:
  - Retirement age <= current age
  - Equity + fixed income != 100%
  - Negative values where not allowed
- **THEN** form displays error messages and prevents submission

### Requirement: Form Submission
The system SHALL send validated inputs to backend API.

#### Scenario: User submits valid form
- **WHEN** user clicks submit on complete form
- **THEN** system calls `/fourpercent/api/v4/retirement` endpoint with full input payload

## ADDED Requirements (Backend API)

### Requirement: Retirement calculation endpoint
The system SHALL provide an API endpoint that accepts retirement inputs and returns projections.

#### Scenario: Successful calculation
- **WHEN** client POSTs valid `RetirementInput` to `/fourpercent/api/v4/retirement`
- **THEN** response includes:
  - Age array (each year from current to end age)
  - Portfolio balance array (annual balances)
  - Income array (annual income from all sources)
  - Expenses array (annual withdrawals adjusted for inflation)
  - Net income array
  - Success boolean
  - Final, average, max, min balances

### Requirement: Validation error handling
The system SHALL return 400 Bad Request for invalid inputs.

#### Scenario: Input validation fails
- **WHEN** client submits data with:
  - Equity + fixed income != 100%
  - Retirement age <= current age
  - Projection period > 120 years
- **THEN** response returns HTTP 400 with error message listing issues

### Requirement: Success metric calculation
The system SHALL determine if the retirement plan succeeds.

#### Scenario: Portfolio remains positive throughout
- **WHEN** all annual balances >= 0
- **THEN** success = true, year_of_depletion = null

#### Scenario: Portfolio depletes early
- **WHEN** any annual balance < 0
- **THEN** success = false, year_of_depletion = first negative year
