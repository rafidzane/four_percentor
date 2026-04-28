## ADDED Requirements

### Requirement: Asset Allocation Auto-Calculation
When a user sets the equity percentage in the retirement calculator, the system must automatically calculate and apply the fixed income percentage as 100% minus the equity percentage.

#### Scenario: Setting equity through slider
- **WHEN** user drags the equity allocation slider to 65%
- **THEN** the system calculates fixed income as 35% (100 - 65)
- **AND** displays "Fixed Income: 35%" alongside the slider

#### Scenario: Entering equity directly
- **WHEN** user types a value of 80 into the equity percentage field
- **THEN** the system updates to show fixed income as 20%

#### Scenario: API request with only equity_pct
- **WHEN** client sends `{"equity_pct": 75}`
- **THEN** server calculates `fixed_income_pct` as 25

### Requirement: Validation
The system must validate that the derived percentage values are within acceptable bounds.

#### Scenario: Edge case - 0% equity
- **WHEN** user sets equity to 0%
- **THEN** fixed income is 100% (valid allocation)

#### Scenario: Edge case - 100% equity
- **WHEN** user sets equity to 100%
- **THEN** fixed income is 0% (valid allocation, though high risk)
