## ADDED Requirements

### Requirement: Retirement results summary display
The system SHALL display a summary of key retirement financial metrics above the charts on the retirement dashboard.

#### Scenario: User views retirement dashboard with results summary
- **WHEN** user navigates to the retirement dashboard page
- **THEN** system displays a results section containing key financial metrics including final balance, average balance, max balance, min balance, and success probability

### Requirement: Retirement results formatting
The system SHALL format financial values appropriately for display.

#### Scenario: Financial values are displayed with correct formatting
- **WHEN** user views the retirement dashboard
- **THEN** monetary values are displayed in dollars with 3 decimal places (e.g., $2,595,879.767) and currency symbol

### Requirement: Retirement results explanatory text
The system SHALL provide explanatory text about projection assumptions.

#### Scenario: Explanatory text is displayed with results
- **WHEN** user views the retirement dashboard
- **THEN** system displays explanatory text about the assumptions and limitations of the projections, including that actual results may vary significantly due to market fluctuations, changing spending patterns, and other factors

### Requirement: Retirement results layout
The system SHALL position the results section above charts in the right column of the dashboard.

#### Scenario: Results section is positioned correctly on dashboard
- **WHEN** user views the retirement dashboard
- **THEN** the results section appears above the charts in the right column of the two-column layout, with appropriate spacing and visual separation