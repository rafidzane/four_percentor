## ADDED Requirements

### Requirement: Household results display in 3x2 grid layout
The system SHALL render the six household result metrics in a grid with 3 columns and 2 rows.

#### Scenario: Desktop view
- **WHEN** screen width is ≥ 768px
- **THEN** results display in 3 columns (grid-cols-3)

#### Scenario: Mobile view  
- **WHEN** screen width is < 768px
- **THEN** results stack into a single column (grid-cols-1)

### Requirement: All metrics preserved
The system SHALL display all six household metrics without any data loss or removal.

#### Scenario: Display all metrics
- **WHEN** results are calculated successfully
- **THEN** the following metrics are displayed:
  - Total Household Net Worth at Retirement
  - Total Household Liquid Savings
  - Total Monthly Income at Retirement
  - Combined Social Security (Monthly)
  - Safe Annual Withdrawal (4% Rule)
  - Years Until Retirement

### Requirement: Color-coded borders maintained
Each metric SHALL retain its original border color for visual identification.

#### Scenario: Metric border colors
- **WHEN** results are displayed
- **THEN** each metric has its designated border color:
  - Green for Total Household Net Worth
  - Blue for Total Household Liquid Savings
  - Purple for Total Monthly Income
  - Teal for Combined Social Security
  - Orange for Safe Annual Withdrawal
  - Yellow for Years Until Retirement

## MODIFIED Requirements

### Requirement: Results container layout
**From:** Vertical stack with `space-y-4` spacing  
**To:** CSS Grid with `grid-cols-3` layout (responsive to `grid-cols-1` on mobile)

#### Scenario: Layout conversion
- **WHEN** household results are rendered
- **THEN** container uses `display: grid` with column configuration
- **AND** gap between cards is 1rem (16px)
