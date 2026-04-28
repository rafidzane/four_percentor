## ADDED Requirements

### Requirement: Historical Year Selection UI
When simulation mode is set to "single_year", the system must display a control for selecting the historical year.

#### Scenario: User selects single_year mode
- **WHEN** user changes simulation mode to "single_year"
- **THEN** the historical year input field becomes visible

### Requirement: Valid Year Range
The system must only accept years within the available historical data range (1871-2025).

#### Scenario: Entering valid year
- **WHEN** user enters 1929
- **THEN** input is accepted and calculation proceeds with that year's data

#### Scenario: Entering invalid year (too low)
- **WHEN** user enters 1800
- **THEN** validation error shows "Year must be between 1871 and 2025"

#### Scenario: Entering invalid year (too high)
- **WHEN** user enters 2030
- **THEN** validation error shows "Year must be between 1871 and 2025"

### Requirement: Quick Select Presets
Provide quick-select buttons for historically significant market events.

#### Scenario: User clicks 1929 preset button
- **WHEN** user selects the "1929 - Stock Market Crash" preset
- **THEN** year input is set to 1929
