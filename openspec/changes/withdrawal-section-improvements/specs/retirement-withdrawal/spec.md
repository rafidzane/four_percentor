## MODIFIED Requirements

### Requirement: Period 2 visibility controlled by checkbox
The system SHALL only display Period 2 withdrawal configuration when the user explicitly enables it via the "Configure Period 2 spending" checkbox. The default state for all users is disabled (Period 2 hidden).

#### Scenario: User enables Period 2
- **WHEN** user checks the "Configure Period 2 spending" checkbox
- **THEN** the system displays a new row with age range, withdrawal type switch, and withdrawal value inputs identical to Period 1

#### Scenario: User disables Period 2
- **WHEN** user unchecks the "Configure Period 2 spending" checkbox  
- **THEN** the system hides all Period 2 configuration fields immediately

### Requirement: Withdrawal type selector uses switch component
The system SHALL use a shadcn/ui Switch component to allow users to select between "Amount" and "Pct" withdrawal types for each period. The switch is positioned horizontally with "Amount" on the left and "Pct" on the right.

#### Scenario: User selects Amount withdrawal type
- **WHEN** user slides the switch to the left position (Amount)
- **THEN** the system displays a numeric input field accepting fixed dollar amounts
- **AND** the input accepts values from 0 with minimum increment of $100

#### Scenario: User selects Pct withdrawal type
- **WHEN** user slides the switch to the right position (Pct)
- **THEN** the system displays a numeric input field accepting percentage values
- **AND** the input accepts values from 0% to 100% with minimum increment of 0.5%

### Requirement: Withdrawal type switch has descriptive labels
The system SHALL display "Amount" and "Pct" labels adjacent to the switch positions to clearly indicate what each position represents. These labels update their visual emphasis based on current selection state.

#### Scenario: Amount is selected
- **WHEN** user selects Amount withdrawal type via switch
- **THEN** the "Amount" label displays with primary color and "Pct" label displays in muted/secondary color

#### Scenario: Pct is selected  
- **WHEN** user selects Pct withdrawal type via switch
- **THEN** the "Pct" label displays with primary color and "Amount" label displays in muted/secondary color
