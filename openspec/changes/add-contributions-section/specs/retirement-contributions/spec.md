## ADDED Requirements

### Requirement: User can input annual contributions to retirement portfolio
The system SHALL allow users to specify their annual contribution amounts and growth rates in the personal information form.

#### Scenario: User enters valid contribution data
- **WHEN** user enters a positive annual contribution amount and percentage increase
- **THEN** system stores these values and uses them in retirement calculations

#### Scenario: User enters default contribution values
- **WHEN** user does not modify the default contribution fields
- **THEN** system uses default values of $10,000 annual contribution and 3% increase rate

### Requirement: Contribution data is properly validated
The system SHALL validate that contribution inputs are positive numbers.

#### Scenario: User enters negative contribution amount
- **WHEN** user enters a negative annual contribution value
- **THEN** system displays an error message and prevents saving the form

#### Scenario: User enters invalid percentage increase
- **WHEN** user enters a non-numeric or negative percentage increase
- **THEN** system displays an error message and prevents saving the form