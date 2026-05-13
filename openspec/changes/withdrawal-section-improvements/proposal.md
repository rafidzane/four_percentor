## Why

The withdrawal strategy section has two issues: (1) Period 2 appears by default instead of being hidden behind a checkbox toggle, and (2) the custom slider component for switching between "Amount" and "Pct" doesn't work properly and looks broken. Users need clear visual feedback when selecting their withdrawal type.

## What Changes

- **Hide Period 2 by default**: The second spending period will only appear when users check a "Configure Period 2" checkbox
- **Replace slider with toggle switch**: Use shadcn/ui Switch component for Amount/Pct selection instead of the broken custom slider
- **Remove TypeToggleSlider component**: Delete the non-functional type-toggle-slider.tsx file

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `retirement-withdrawal`: Period 2 visibility logic and withdrawal type selector UI

## Impact

**Frontend only:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx` - Update period 2 conditional rendering and replace slider with switch
- `/frontend/src/components/ui/type-toggle-slider.tsx` - Delete this file
- No backend API changes required
