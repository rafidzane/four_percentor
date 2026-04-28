## Why

The current retirement calculator only supports a single spending period with a uniform withdrawal rate. This limitation prevents users from modeling more complex spending strategies where their withdrawal approach changes based on age or life stage.

A two-period spending mode allows users to:
1. Define different spending patterns for pre-retirement and post-retirement periods
2. Specify distinct age ranges and withdrawal percentages for each period
3. Model realistic spending behaviors where early retirement years may have different spending needs than later years

## What Changes

- Add a "Two-period spending mode" toggle in the Withdrawal Strategy section
- When enabled, show separate inputs for:
  - Period 1: Age range start and end, withdrawal percentage 
  - Period 2: Age range start and end, withdrawal percentage
- Update backend calculations to handle two distinct spending periods

## Capabilities

### New Capabilities
- `retirement-two-period-spending`: Support for dual-age-range withdrawal strategies
- `retirement-age-specific-withdrawal`: Apply different withdrawal rates based on age ranges

### Modified Capabilities
- `retirement-withdrawal-calculation`: Adjusted to compute spending across multiple periods

## Impact

- **Frontend**: Add toggle switch and additional form fields for two-period inputs
- **Backend**: Modify spending calculation logic to handle multiple spending periods
- **UX**: Users can now model more sophisticated withdrawal strategies that match real-world behavior