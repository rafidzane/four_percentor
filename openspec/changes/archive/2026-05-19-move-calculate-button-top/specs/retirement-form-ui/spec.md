## MODIFIED Requirements

### Requirement: Calculate button location
The retirement calculator form **SHALL** display the primary "Calculate Projection" button in the top-right column above the results summary section, instead of at the bottom of the form.

#### Scenario: Desktop layout - Calculate button position
- **WHEN** user views the retirement calculator on desktop (>1024px width)
- **THEN** the "Calculate Projection" button appears in the right column header
- **AND** the button is positioned above the retirement summary cards
- **AND** the button spans full width of its container

#### Scenario: Mobile/tablet layout - Calculate button position
- **WHEN** user views the retirement calculator on tablet or mobile (<1024px width)
- **THEN** the "Calculate Projection" button appears at top of screen (before form sections)
- **AND** the button spans full width of screen

#### Scenario: Button state during calculation
- **WHEN** user clicks "Calculate Projection" button
- **THEN** button enters disabled state
- **AND** button text changes to show loading spinner with "Calculating..."
- **AND** no other input fields are editable during calculation

## ADDED Requirements

This change does not add any new capabilities or requirements. It only repositions the existing calculate button for improved UX.

## REMOVED Requirements

This change does not remove any capabilities or requirements. The calculate functionality remains unchanged, only its placement in the UI.
