# Withdrawal Strategy UI Change Design

## Overview
This document outlines the changes to the retirement dashboard UI to position the "Adjust for inflation" checkbox to the right of the Withdrawal Strategy section on the same line, rather than below it.

## Current State
The "Adjust for inflation" checkbox was positioned below the withdrawal strategy configuration in the RetirementForm component. This made the UI feel less compact and reduced information density.

## Proposed Change
Move the "Adjust for inflation" checkbox to be displayed inline with the Withdrawal Strategy section, to the right of the main configuration controls.

## Implementation Details

### File Modified
- `/home/rafid/devel/four_percentor/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx`

### Changes Made
1. Removed the standalone checkbox that was positioned below the withdrawal strategy section
2. Added the "Adjust for inflation" checkbox as part of a new inline layout within the Withdrawal Strategy section
3. Positioned the checkbox on the same line as the other withdrawal configuration controls

### UI Structure
The updated structure places the "Adjust for inflation" checkbox directly after the main withdrawal strategy configuration but on the same line, improving visual flow and screen real estate usage.

## Visual Layout
Before:
```
[Withdrawal Strategy Section]
[Adjust for inflation checkbox (below)]
[Period 1 Configuration]
[Period 2 Configuration]
```

After:
```
[Withdrawal Strategy Section]
[Period 1 Configuration]
[Period 2 Configuration]
[Adjust for inflation checkbox (inline)]
```

## Technical Considerations
- The change is purely a UI layout modification with no functional changes to the form logic or data handling
- All existing functionality remains intact
- Form validation and submission behavior unchanged
- The checkbox maintains its proper association with the `retirement_spending.adjust_for_inflation` field in the form state

## Testing
The change should be tested with:
1. Form rendering in different screen sizes
2. Checkbox interaction and value changes
3. Form submission with various withdrawal strategy configurations
4. Responsiveness on mobile devices

This design maintains all existing functionality while improving UI compactness and information density.