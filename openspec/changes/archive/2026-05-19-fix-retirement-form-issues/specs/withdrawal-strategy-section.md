## MODIFIED Requirements

### Requirement: Period 2 configuration visibility
Period 2 withdrawal configuration should only be visible when the "Configure Period 2 spending" toggle is enabled.

#### Scenario: Period 2 hidden by default
- **WHEN** user loads the form with `two_period_mode` set to false (default)
- **THEN** Period 2 start age, end age, type, and value fields are not visible

#### Scenario: Period 2 shown when toggle enabled
- **WHEN** user clicks "Configure Period 2 spending" checkbox to enable it
- **THEN** Period 2 start age, end age, type, and value fields become visible

#### Scenario: Period 2 hidden when toggle disabled
- **WHEN** user clicks "Configure Period 2 spending" checkbox to disable it
- **THEN** Period 2 fields are hidden from view

### Requirement: Valid period ordering
Period 2 end age must be greater than its start age.

#### Scenario: Validation error for invalid end age
- **WHEN** user sets period 2 end age less than or equal to period 2 start age
- **THEN** form displays validation error "End age must be greater than start age"

## ADDED Requirements

### Requirement: Proper conditional rendering wrapper
The Period 2 configuration section MUST be wrapped in a conditional that checks `two_period_mode` value before rendering.

#### Scenario: Conditional rendering works correctly
- **WHEN** two_period_mode is false
- **THEN** Period 2 section is not rendered to DOM
- **AND** when two_period_mode becomes true
- **THEN** Period 2 section renders with proper form field bindings
