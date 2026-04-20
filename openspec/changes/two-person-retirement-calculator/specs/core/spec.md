## ADDED Requirements

### Requirement: Dual-person compound growth calculation
The system SHALL calculate future value for each person's liquid assets with monthly contributions, then sum the results.

#### Scenario: Separate growth projections
- **WHEN** calculating household savings at retirement
- **THEN** system:
  1. Calculates husband's liquid savings using compound interest formula
  2. Calculates spouse's liquid savings using compound interest formula  
  3. Sums both to get total household liquid savings

### Requirement: Social Security benefit aggregation
The system SHALL estimate each person's Social Security benefit independently based on their claiming age, then sum them.

#### Scenario: Individual benefit calculation
- **WHEN** calculating household Social Security benefits
- **THEN** system:
  1. Estimates husband's benefit at his claimed age (62-70)
  2. Estimates spouse's benefit at her claimed age
  3. Returns the sum as combined benefit

### Requirement: Longest timeline projection
The system SHALL project household finances based on the person with the longest retirement horizon.

#### Scenario: Different retirement ages
- **WHEN** husband retires at age 62 and spouse at age 67
- **THEN** household projections continue until both have retired, using the longer timeline for balance forecasting

### Requirement: Net worth calculation
The system SHALL calculate total net worth as the sum of:
- Combined liquid savings at retirement
- Combined illiquid assets (not subject to investment growth)

#### Scenario: Asset aggregation
- **WHEN** calculating household net worth
- **THEN** system sums husband and spouse's liquid + illiquid assets

### Requirement: Monthly income calculation
The system SHALL calculate total monthly household income as:
- Safe withdrawal amount / 12 (4% rule on combined liquid savings)
- Plus combined Social Security benefit

#### Scenario: Income breakdown
- **WHEN** calculating retirement income
- **THEN** system provides:
  - Total monthly income
  - Breakdown of withdrawal portion
  - Breakdown of Social Security portion

## Modified Requirements

### Requirement: Calculation engine
**MODIFIED**: Engine now supports both single-person (backward compatible) and dual-person calculations

#### Scenario: Single-person mode
- **WHEN** input contains only one person's data (spouse fields empty/null)
- **THEN** system uses simplified single-person calculation logic for performance

### Requirement: Withdrawal strategy recommendation
**MODIFIED**: Strategy considers household timeline (longest retirement horizon)

#### Scenario: Strategy determination
- **WHEN** determining recommended withdrawal strategy
- **THEN** system bases decision on:
  - Years until both retire (if different)
  - Combined portfolio size
  - Expected household lifespan
