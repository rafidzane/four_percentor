## Why

The current asset allocation validation requires equity + fixed income to sum exactly to 100%. This creates a usability issue where adjusting one slider requires manually updating the other, leading to potential validation errors and confusion.

Users expect an intuitive UI where setting the equity percentage automatically calculates the fixed income portion as the remainder (100% - equity).

## What Changes

- Modify the PortfolioAllocationInput model to accept only `equity_pct` as a required field
- Derive `fixed_income_pct` automatically as `100 - equity_pct`
- Update UI to show only one slider for asset allocation
- Display calculated fixed income percentage alongside the equity slider

## Capabilities

### New Capabilities
- `retirement-auto-calculate-allocation`: When user sets equity percentage, fixed income is automatically derived

### Modified Capabilities
None

## Impact

- **Frontend**: Simplified UI with single slider for asset allocation
- **Backend**: Model change - `fixed_income_pct` becomes optional with default calculation
- **API**: Existing API calls will continue to work (backward compatible)
