## ADDED Requirements

### Requirement: Period 2 complete input configuration
When two_period_mode is enabled, the system SHALL allow users to configure Period 2 with a complete set of inputs including start age, end age, withdrawal type (amount or percentage), and withdrawal value.

#### Scenario: Two-period mode shows complete period 2 section
- **WHEN** user enables two_period_mode checkbox
- **THEN** the UI displays full Period 2 configuration section with:
  - Start Age input (numeric field)
  - End Age input (numeric field)
  - Type toggle (Amount/Percentage switch)
  - Value input (amount in $ or percentage % based on type selection)

#### Scenario: Period 2 value input dynamically switches
- **WHEN** user toggles between Amount and Percentage types
- **THEN** the Value input field updates to show appropriate unit ($ for amount, % for percentage)

#### Scenario: Period 2 age validation
- **WHEN** user enters Period 2 start/end ages
- **THEN** system validates:
  - Both values are >= 18 and <= 100
  - period_2_end_age > period_2_start_age

### Requirement: Backend accepts period 2 withdrawal configuration
The backend API SHALL accept and process Period 2 withdrawal strategy data as part of the retirement calculation.

#### Scenario: Calculate projection with period 2 configuration
- **WHEN** user submits retirement form with two_period_mode enabled and complete period_2_* fields populated
- **THEN** backend processes simulation using:
  - period_2_start_age through period_2_end_age range
  - period_2_withdrawal_type to determine calculation method
  - period_2_withdrawal_amount OR period_2_withdrawal_pct based on type

#### Scenario: Backend validation of period 2 data
- **WHEN** API receives withdrawal strategy with period 2 fields
- **THEN** backend validates:
  - period_2_end_age >= period_2_start_age
  - If type is "percentage", period_2_withdrawal_pct must be between 0 and 100
  - If type is "amount", period_2_withdrawal_amount must be >= 0

### Requirement: Form state persists period 2 data
The React form SHALL maintain Period 2 field values across re-renders and form interactions.

#### Scenario: Switching between periods preserves form data
- **WHEN** user fills out Period 1 inputs, enables two_period_mode, and fills Period 2 inputs
- **THEN** all field values are preserved when toggling settings or viewing validation errors
