## ADDED Requirements

### Requirement: Retirement dashboard input field styling
The retirement dashboard shall implement reduced padding in input fields and labels to create a more compact layout.

#### Scenario: Input fields have reduced padding
- **WHEN** user views the retirement dashboard inputs
- **THEN** input fields have reduced padding (px-2 py-1) compared to previous implementation

#### Scenario: Labels have reduced spacing
- **WHEN** user views the retirement dashboard inputs
- **THEN** labels have reduced bottom margin (mb-0.5) compared to previous implementation

#### Scenario: Form elements have tighter vertical spacing
- **WHEN** user views the retirement dashboard inputs
- **THEN** vertical spacing between form elements is reduced from space-y-2 to space-y-1

#### Scenario: Font sizes are reduced for compactness
- **WHEN** user views the retirement dashboard inputs
- **THEN** labels and input fields use text-xs font size instead of text-sm

#### Scenario: Grid gaps are reduced
- **WHEN** user views the retirement dashboard inputs
- **THEN** grid gaps between form sections are reduced from gap-6 to gap-4