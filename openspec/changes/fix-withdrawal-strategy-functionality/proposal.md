## Why

The `WithdrawalStrategySection` component in the retirement form has two critical functionality bugs that prevent users from properly configuring a comprehensive two-period withdrawal strategy:

1. **Non-functional percentage/amount toggle**: The switch toggle for selecting between percentage-based and fixed-dollar withdrawal types does not actually change which input field is displayed. Both periods always show the "Amount" input regardless of the toggle position.

2. **Period 2 visibility control broken**: The "Configure Period 2 spending" checkbox fails to show or hide the Period 2 configuration panel, making it impossible for users to set up multi-phase retirement withdrawal strategies.

These bugs prevent realistic financial planning that accounts for different spending patterns across early/mid/late retirement stages.

## What Changes

- Fix the withdrawal type toggle logic so that switching between "Percentage" and "Amount" immediately updates which input field is displayed
- Ensure the Period 2 checkbox correctly toggles visibility of the Period 2 configuration panel
- Maintain backward compatibility with existing form validation and submission logic
- Preserve all current styling and accessibility features

## Capabilities

### New Capabilities
None - this is a bug fix, not a new feature.

### Modified Capabilities
- `retirement-withdrawal-strategy`: Fix broken toggle behavior for withdrawal type selection (percentage vs amount) in both Period 1 and Period 2 sections.

## Impact

**Affected files:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

**What changes:**
- Conditional rendering logic for withdrawal input fields must use the actual `watch()` value from react-hook-form instead of hardcoded `{false ? ...}`
- Period 2 visibility control must properly bind to form state
- Input field IDs and register targets must match the selected withdrawal type

**No breaking changes:**
- Existing form data structure remains unchanged
- Backend model compatibility maintained
- Default values continue to work as expected
