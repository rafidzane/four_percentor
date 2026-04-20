## Why

The two-person retirement calculator page shows collapsible section chevrons (arrows) next to "Husband's Projection" and "Spouse's Projection" sections. These chevrons have no functional use since the sections are always expanded by default and don't provide value to users.

## What Changes

- Remove the chevron icons from the CollapsibleSection components for husband and spouse projections
- Maintain all other collapsible section functionality (title, content)

## Capabilities

### Modified Capabilities
- `two-person-retirement-calculator`: The visual display of individual projection sections will change to remove chevron icons.

## Impact

- `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx:501-508, 511-518`: CollapsibleSection components for husband and spouse projections
