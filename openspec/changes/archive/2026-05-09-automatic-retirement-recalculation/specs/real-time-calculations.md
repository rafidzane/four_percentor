## ADDED Requirements

### Requirement: System automatically recalculates on form value changes
The system SHALL automatically trigger recalculation when any retirement form input value changes, without requiring manual submission.

#### Scenario: User modifies portfolio allocation percentage
- **WHEN** user changes equity allocation from 60% to 70%
- **THEN** the system recalculates and displays updated projection results within 500ms (after debounce)

#### Scenario: User enters new initial portfolio value
- **WHEN** user updates initial portfolio value from $500,000 to $600,000
- **THEN** the system immediately schedules recalculation and displays updated results after debounce completes

### Requirement: Calculation triggers are debounced to prevent excessive processing
The system SHALL debounce calculation triggers with a minimum delay of 300ms and maximum of 500ms from user input completion.

#### Scenario: User rapidly types in numeric field
- **WHEN** user types "100000" character by character (100, 1000, 10000, 100000)
- **THEN** the system only triggers one calculation after typing stops for at least 300ms

#### Scenario: User switches between form tabs/sections
- **WHEN** user completes editing in Portfolio Assets section and moves to Withdrawal Strategy section
- **THEN** any pending calculations from previous section are cancelled and new calculation is scheduled if needed

### Requirement: System provides visual feedback during active calculations
The system SHALL display a loading state indicator when recalculation is in progress.

#### Scenario: Calculation is processing after form change
- **WHEN** user completes editing and calculation is running
- **THEN** the results section displays a skeleton loader or spinner indicating "Calculating..."

#### Scenario: User makes another change while calculation is pending
- **WHEN** user modifies a field before previous calculation completes
- **THEN** system cancels previous calculation and shows loading state for new calculation

### Requirement: System handles calculation errors gracefully
The system SHALL catch and display meaningful error messages when calculations fail.

#### Scenario: Invalid input causes calculation failure
- **WHEN** user enters negative portfolio value or invalid percentage (>100% total allocation)
- **THEN** system displays inline validation error in affected field and shows error banner without crashing

#### Scenario: Backend calculation service is unavailable
- **WHEN** server returns 5xx error during async calculation request (if applicable)
- **THEN** system displays user-friendly error message with option to retry

### Requirement: System maintains calculation state across form navigation
The system SHALL preserve the most recent calculation results while allowing users to navigate between form sections.

#### Scenario: User navigates from Portfolio Assets to Income Sources section
- **WHEN** user clicks on Income Sources tab after portfolio calculation completes
- **THEN** previous calculation results remain visible (not cleared) and can be seen when returning to main view

### Requirement: System only recalculates when values actually change
The system SHALL track form state and avoid triggering redundant calculations for unchanged values.

#### Scenario: User re-focuses a field without changing value
- **WHEN** user clicks into a field that already has a valid value but doesn't modify it
- **THEN** no calculation is triggered

#### Scenario: Form validation fails on input blur
- **WHEN** user enters invalid value and loses focus (blur event) before debounce completes
- **THEN** system does not trigger calculation for invalid state, instead shows validation error
