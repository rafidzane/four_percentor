## ADDED Requirements

### Requirement: Health Status Selection
Users must be able to select their health status from a predefined scale.

#### Scenario: User selects "Excellent" health
- **WHEN** user chooses excellent health status
- **THEN** longevity estimate is increased by approximately 4 years
- **AND** healthcare cost projections use lower escalation rate

#### Scenario: User selects "Fair" health
- **WHEN** user chooses fair health status
- **THEN** longevity estimate is reduced by approximately 1 year
- **AND** healthcare cost projections use higher escalation rate

### Requirement: Chronic Conditions Input
Allow users to indicate presence of chronic conditions.

#### Scenario: User indicates diabetes
- **WHEN** user selects diabetes from conditions list
- **THEN** annual healthcare costs increase by estimated amount
- **AND** long-term care probability increases

#### Scenario: Multiple conditions selected
- **WHEN** user selects multiple chronic conditions
- **THEN** healthcare cost multiplier applies cumulatively (with diminishing returns)

### Requirement: Lifespan Override
Allow users to manually set expected lifespan if they have family history or other considerations.

#### Scenario: User enters custom lifespan
- **WHEN** user inputs a specific target age (e.g., 95)
- **THEN** retirement projection runs to that age regardless of health-based estimate
- **AND** success probability reflects reaching the specified age
