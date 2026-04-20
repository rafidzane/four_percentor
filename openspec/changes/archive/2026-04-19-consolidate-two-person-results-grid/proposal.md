## Why

The Two-Person Retirement Calculator displays 6 result metrics as individual stacked cards, taking up significant vertical space. This makes it harder to quickly compare values and wastes screen real estate on a dashboard page.

## What Changes

- Consolidate the 6 household result metrics into a single 3x2 grid layout
- Maintain all current metrics: Total Household Net Worth, Liquid Savings, Monthly Income, Combined Social Security, Safe Annual Withdrawal, Years Until Retirement
- No functional changes - only visual reorganization

## Capabilities

### Modified Capabilities
- `two-person-retirement-calculator`: Update UI rendering for result cards to use grid layout instead of stacked vertical layout

## Impact

- **Frontend**: `/frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`
  - Replaces current vertical card layout (lines 440-509) with a CSS Grid 3x2 layout
  - All existing data fields remain unchanged
  - No API changes required
