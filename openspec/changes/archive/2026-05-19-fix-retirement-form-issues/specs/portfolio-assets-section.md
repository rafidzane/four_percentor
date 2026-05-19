## MODIFIED Requirements

### Requirement: Returns Simulation section location
Returns Simulation configuration must appear immediately after Contributions within the Portfolio Assets section.

#### Scenario: Returns Simulation positioned correctly
- **WHEN** user views Portfolio Assets section
- **THEN** Returns Simulation content appears directly below Contributions section
- **AND** both sections share the same container card

### Requirement: Contribution fields visibility
Yearly contribution and related fields must be visible in Portfolio Assets section.

#### Scenario: Contribution fields displayed
- **WHEN** user views Portfolio Assets section
- **THEN** Yearly contribution, contribution increase %, and catch-up contributions fields are visible

## ADDED Requirements

### Requirement: Returns Simulation implementation
Returns Simulation content must be fully implemented with timeline inputs (equity return pre/post retirement, fixed income return, inflation rate).

#### Scenario: Returns simulation inputs present
- **WHEN** user views Portfolio Assets section
- **THEN** Returns Simulation section shows equity return pre-retirement % field
- **AND** shows equity return post-retirement % field
- **AND** shows fixed income return % field
- **AND** shows inflation rate % field

### Requirement: Visual grouping of returns inputs
Returns Simulation fields should be grouped under a clearly labeled subsection.

#### Scenario: Returns section clearly identified
- **WHEN** user scans Portfolio Assets section
- **THEN** Returns Simulation is visually distinct from Contributions section
- **AND** uses appropriate heading to identify its purpose
