## Why

The current two-person retirement calculator displays the spouse's projection below the husband's projection. Users want to view both projections side-by-side for easier comparison, with the husband's projection on the left and the spouse's projection on the right.

## What Changes

- Reorder individual projections display: Husband's Projection (left) | Spouse's Projection (right)
- Update grid layout to support side-by-side display of individual projections
- Maintain existing collapsible section behavior for both projections

## Capabilities

### Modified Capabilities
- `two-person-retirement-calculator`: The visual layout and ordering of individual projections needs to change from vertical stacking to horizontal side-by-side arrangement.

## Impact

- `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx:491-510`: Individual projection display section that currently shows husband first, then spouse in vertical layout. Needs reorganization into a 2-column grid or flex layout.
