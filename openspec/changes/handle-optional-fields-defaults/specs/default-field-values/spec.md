## ADDED Requirements

### Requirement: Optional fields have sensible defaults
When optional fields in retirement calculation inputs are not provided by the frontend, they should be defaulted to sensible values rather than causing validation errors.

#### Scenario: Missing real estate total property value
- **WHEN** a retirement calculation request is made with no `real_estate.total_property_value` field
- **THEN** the system should default this field to 0.0

#### Scenario: Missing rental property income fields
- **WHEN** a retirement calculation request is made with `rental_properties` that have missing `net_annual_income` or `until_age` fields
- **THEN** the system should default these fields to appropriate values (0.0 for income, 65 for until_age)

#### Scenario: Missing optional section entirely
- **WHEN** a retirement calculation request is made with no `real_estate` section at all
- **THEN** the system should create a default empty real_estate object with proper defaults

### Requirement: None values are handled gracefully in calculations
When calculation logic encounters None values for optional fields, it should skip processing those fields rather than failing.

#### Scenario: None income value in rental property
- **WHEN** a retirement calculation processes a rental property with `net_annual_income` set to None
- **THEN** that property's income contribution should be skipped in the total calculation

#### Scenario: None until_age value in rental property  
- **WHEN** a retirement calculation processes a rental property with `until_age` set to None
- **THEN** that property's income contribution should be skipped in the total calculation