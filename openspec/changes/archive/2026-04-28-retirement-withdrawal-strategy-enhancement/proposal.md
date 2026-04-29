## Why

The current withdrawal strategy form in the retirement calculator has limited functionality when it comes to specifying spending modes. Users can only choose between "4% Rule" or "Manual Withdrawal Amount", but there's no clear distinction between whether the manual input should be an amount or percentage. Additionally, the two-period spending mode doesn't properly reflect the choice of percentage vs amount for each time period, and lacks default age ranges.

This enhancement will improve the user experience by providing clearer options for withdrawal strategies, better handling of different input types (amount vs percentage), and more intuitive configuration for two-period spending models.

## What Changes

- Enhance the spending mode selection to clearly distinguish between amount-based and percentage-based inputs
- Add a checkbox to adjust spending amounts for inflation when using manual withdrawal amounts
- Improve the two-period spending mode to support both percentage and amount-based inputs for each period
- Set default age ranges for two-period mode (50-62 and 63-end of retirement)
- Update form validation and UI to support these new configurations

## Capabilities

### New Capabilities
- `withdrawal-strategy-inputs`: Specification for enhanced withdrawal strategy input handling
- `spending-mode-configuration`: Requirements for configuring spending modes with proper input types

### Modified Capabilities
- `retirement-calculator-ui`: The user interface requirements for the retirement calculator have been updated to include better spending mode configuration

## Impact

- Affects frontend code in `/frontend/src/app/(main)/dashboard/retirement` directory
- Changes the structure and logic of the withdrawal strategy form
- May impact existing data models if backend needs to support new input formats
- Requires updating tests for the modified form components