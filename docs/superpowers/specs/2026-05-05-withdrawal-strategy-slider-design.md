# Withdrawal Strategy Slider Implementation

## Overview
Replace the current button-based toggle system for withdrawal strategy types (percentage vs amount) with standard toggle switches in both Period 1 and Period 2 sections of the retirement form.

## Current State
The form currently uses two buttons ("Pct" and "Amt") to switch between percentage and fixed dollar amount withdrawal strategies. This approach works but could be improved with a more modern, intuitive interface.

## Requirements
- Replace buttons with toggle switches for both Period 1 and Period 2 withdrawal types
- Maintain immediate switching behavior (no confirmation required)
- Keep existing functionality intact (same data model, same validation)
- Ensure proper labeling and tooltips remain
- Follow existing UI patterns in the application

## Implementation Plan

### Component Changes
1. Replace buttons with toggle switches for `period_1_withdrawal_type`
2. Replace buttons with toggle switches for `period_2_withdrawal_type`
3. Maintain same data flow: values are still stored as "percentage" or "amount"
4. Keep existing input fields that display based on the selected type

### UI Structure
Each withdrawal strategy section will have:
- Label: "Type" (unchanged)
- Toggle switch: visually indicates current mode (percentage/amount)
- Tooltip: provides context about the selection (unchanged)

### Data Flow
- The toggle switches will set the same values as before ("percentage" or "amount")
- The conditional rendering of input fields will remain unchanged
- All validation and data processing logic remains intact

## Technical Details

### Toggle Switch Implementation
The toggle switch will be implemented using:
- A standard checkbox input with custom styling
- CSS classes to create the visual toggle appearance
- Proper accessibility attributes (aria-label, etc.)
- React Hook Form integration for state management

### Visual Design
- Toggle switches should match the existing form's styling
- Should use primary/secondary colors consistent with the current design
- Should be properly aligned with existing form elements
- Should include proper spacing and visual hierarchy

## Validation Criteria
1. Toggle switches function correctly, immediately switching modes
2. Existing input fields update appropriately based on selected mode
3. Form validation continues to work as expected
4. All tooltips and labels remain functional
5. No breaking changes to data model or functionality
6. UI maintains consistency with existing form design

## Future Considerations
- Consider adding animation when switching between modes for better user experience
- Evaluate whether the toggle switches should be disabled when certain conditions are met