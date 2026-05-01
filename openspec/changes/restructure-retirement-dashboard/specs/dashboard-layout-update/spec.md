## ADDED Requirements

### Requirement: Dashboard layout with inputs on left and charts on right
The retirement dashboard UI SHALL display the input forms on the left side of the screen and the retirement projection charts on the right side.

#### Scenario: Dashboard loads with new layout
- **WHEN** user visits the retirement dashboard
- **THEN** the main input forms are displayed in a column on the left side
- **THEN** the retirement projection charts are displayed in a column on the right side

### Requirement: Results panel positioned above retirement charts
The retirement dashboard UI SHALL position the calculation results panel above the retirement projection charts in the right column.

#### Scenario: Dashboard displays results panel
- **WHEN** user runs a retirement calculation
- **THEN** the results panel is displayed at the top of the right column
- **THEN** the retirement projection charts are displayed below the results panel

### Requirement: Responsive two-column layout
The retirement dashboard UI SHALL maintain proper two-column layout across different screen sizes.

#### Scenario: Dashboard viewed on mobile device
- **WHEN** user accesses the retirement dashboard on a mobile device
- **THEN** the layout stacks vertically with inputs above charts
- **THEN** the results panel remains positioned above the charts

## MODIFIED Requirements

### Requirement: Retirement dashboard UI layout
The retirement dashboard UI SHALL be reorganized to position the results panel at the top of the right column.

#### Scenario: User views retirement dashboard
- **WHEN** user accesses the retirement dashboard
- **THEN** the component structure is updated to place inputs on left and charts on right
- **THEN** the results panel is positioned above the charts in the right column

#### Scenario: User navigates between different sections
- **WHEN** user switches between different retirement scenarios or tabs
- **THEN** the layout maintains its new positioning
- **THEN** no visual artifacts or layout issues occur during navigation