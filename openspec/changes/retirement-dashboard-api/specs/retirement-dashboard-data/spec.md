## ADDED Requirements

### Requirement: API returns retirement dashboard data for charts
The system SHALL provide an API endpoint that returns structured data suitable for retirement dashboard visualizations.

#### Scenario: User requests dashboard data with valid inputs
- **WHEN** user submits retirement planning inputs to `/api/retirement/dashboard` 
- **THEN** system returns a JSON response containing both portfolio value and income vs expenses data

### Requirement: Portfolio value over time data format
The system SHALL return portfolio value data in a time-series format for visualization.

#### Scenario: User requests portfolio data
- **WHEN** user calls the dashboard endpoint
- **THEN** system returns an array of objects with year and portfolio_value fields

### Requirement: Income vs expenses data format  
The system SHALL return income vs expenses data in a time-series format for comparison charts.

#### Scenario: User requests income vs expenses data
- **WHEN** user calls the dashboard endpoint
- **THEN** system returns an array of objects with year, income, and expenses fields

### Requirement: Data consistency with existing calculations
The system SHALL ensure all calculated values are consistent with the retirement simulation engine.

#### Scenario: Dashboard data matches calculation results
- **WHEN** user inputs retirement parameters
- **THEN** dashboard data reflects same calculations as other retirement views

### Requirement: Summary of calculation data
The system SHALL include a summary of key calculation metrics above the Portfolio over time chart.

#### Scenario: User views dashboard with summary
- **WHEN** user accesses the retirement dashboard page
- **THEN** system displays a summary section with key metrics (success rate, portfolio value at retirement, timeline information)