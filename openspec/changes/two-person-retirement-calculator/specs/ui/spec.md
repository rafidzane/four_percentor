## ADDED Requirements

### Requirement: Two-person input form
The system SHALL provide a user interface with separate sections for husband and spouse financial information, including:
- Current age (18-100)
- Retirement age (minimum current age + 1, max 100)
- Liquid assets (savings, stocks, bonds; non-negative)
- Illiquid assets (real estate, private equity; non-negative)
- Monthly contribution amount (non-negative)

#### Scenario: Husband and spouse inputs
- **WHEN** user views the calculator page
- **THEN** system displays two side-by-side input sections labeled "Husband" and "Spouse"
- **AND** each section contains all required financial fields

### Requirement: Different retirement ages
The system SHALL allow each person to have a different retirement age, with optional synchronization.

#### Scenario: Independent retirement ages
- **WHEN** user enters different retirement ages for husband and spouse
- **THEN** system calculates projections based on both individuals' retirement timelines

#### Scenario: Synchronized retirement ages
- **WHEN** user enables "Same retirement age" toggle
- **AND** user changes one person's retirement age
- **THEN** the other person's retirement age updates to match

### Requirement: Combined Social Security benefits
The system SHALL calculate and display combined household Social Security benefits.

#### Scenario: Dual Social Security inclusion
- **WHEN** user enters both individuals' current ages, retirement ages, and social security claiming ages
- **THEN** system calculates each person's benefit separately using their claimed age
- **AND** system displays the sum as total household Social Security benefit

### Requirement: Results aggregation
The system SHALL aggregate individual projections into household-level metrics.

#### Scenario: Combined results display
- **WHEN** calculations complete
- **THEN** system displays:
  - Total years to retirement (longest timeline)
  - Combined liquid savings at retirement
  - Combined net worth at retirement (liquid + illiquid)
  - Total monthly income (withdrawals + Social Security)
  - Safe withdrawal amounts

### Requirement: Error handling for dual-person inputs
The system SHALL validate both individuals' inputs independently.

#### Scenario: Validation errors
- **WHEN** user enters invalid data for one person only
- **THEN** system highlights only that person's invalid fields
- **AND** system shows clear error messages per field

## Modified Requirements

### Requirement: Existing single-person calculator
**Reason**: Two-person calculator provides enhanced functionality  
**Migration**: Users should migrate to two-person calculator even for single-person planning by entering same values for both sections

#### Scenario: Single person using two-person form
- **WHEN** user enters identical inputs for husband and spouse
- **THEN** results match existing single-person calculator output (within rounding)
