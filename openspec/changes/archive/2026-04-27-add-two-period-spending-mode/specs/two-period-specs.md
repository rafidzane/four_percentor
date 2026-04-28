## ADDED Requirements

### Requirement: Two-Period Spending Mode Toggle
The system must provide a way for users to enable/disable two-period spending mode.

#### Scenario: User enables two-period mode
- **WHEN** user clicks the "Two-period spending mode" toggle
- **THEN** additional form fields for period 2 become visible
- **AND** current single-period values are maintained

#### Scenario: User disables two-period mode  
- **WHEN** user turns off the toggle
- **THEN** only single-period inputs remain visible
- **AND** existing behavior is preserved

### Requirement: Period Configuration Inputs
The system must accept configuration for both spending periods.

#### Scenario: User enters period 1 values
- **WHEN** user specifies age range and withdrawal rate for period 1
- **THEN** system stores these values correctly

#### Scenario: User enters period 2 values
- **WHEN** user specifies age range and withdrawal rate for period 2  
- **THEN** system stores these values correctly

### Requirement: Age Range Validation
The system must validate that spending periods are logically ordered.

#### Scenario: Invalid period ordering
- **WHEN** user enters period 1 end age greater than period 2 start age
- **THEN** system displays validation error
- **AND** prevents calculation until corrected

### Requirement: Calculation Engine Update
The system must calculate retirement projections using the two-period spending approach.

#### Scenario: Dual period spending calculation
- **WHEN** two-period mode is enabled 
- **THEN** system applies withdrawal rate P1% for ages in period 1 range
- **AND** system applies withdrawal rate P2% for ages in period 2 range