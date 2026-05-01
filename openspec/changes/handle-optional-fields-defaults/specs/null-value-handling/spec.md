## ADDED Requirements

### Requirement: Graceful handling of null values in retirement calculations
The retirement calculation system must handle null/None values gracefully without throwing validation errors.

#### Scenario: Null income field in rental property
- **WHEN** a retirement calculation request includes rental properties with `net_annual_income` set to null/None
- **THEN** the calculation should skip those properties' income contributions

#### Scenario: Null until_age field in rental property
- **WHEN** a retirement calculation request includes rental properties with `until_age` set to null/None  
- **THEN** the calculation should skip those properties' income contributions

### Requirement: Default values for missing optional sections
When entire optional sections are missing from the retirement input, they should be defaulted appropriately.

#### Scenario: Missing real estate section entirely
- **WHEN** a retirement calculation request does not include a `real_estate` section
- **THEN** the system should create a default real_estate object with appropriate defaults

#### Scenario: Missing rental properties section entirely
- **WHEN** a retirement calculation request does not include a `rental_properties` section  
- **THEN** the system should provide default rental property entries with appropriate values