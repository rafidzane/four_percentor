## Overview

Fix the `WithdrawalStrategySection` component to properly implement withdrawal type toggling and Period 2 visibility control.

## Root Cause Analysis

### Bug 1: Non-functional percentage/amount toggle
The current implementation has a hardcoded conditional that always evaluates to false:
```tsx
{false ? (
  // Percentage input - NEVER rendered
) : (
  // Amount input - ALWAYS rendered
)}
```

This means regardless of the `period_1_withdrawal_type` or `period_2_withdrawal_type` state, only the Amount input is ever shown.

### Bug 2: Period 2 checkbox not working
The "Configure Period 2 spending" checkbox is registered with react-hook-form via `{...register("retirement_spending.two_period_mode")}`, but there's no explicit `value` prop binding. While this should work, the conditional rendering at the end uses `{twoPeriodMode && ...}` where `twoPeriodMode` comes from a separate `watch()` call that may have stale state.

## Fix Strategy

### Withdrawal Type Toggle Fix
Replace the hardcoded `{false ? ...}` with a dynamic conditional that checks the actual form field value:

```tsx
// For Period 1:
{period1WithdrawalType === "percentage" ? (
  // Show percentage input
) : (
  // Show amount input
)}

// For Period 2 (inside twoPeriodMode block):
{period2WithdrawalType === "percentage" ? (
  // Show percentage input
) : (
  // Show amount input
)}
```

### Period 2 Visibility Fix
The `twoPeriodMode` variable is already correctly watching the form field:
```tsx
const twoPeriodMode = watch("retirement_spending.two_period_mode");
```
And the checkbox uses proper registration:
```tsx
<input {...register("retirement_spending.two_period_mode")} type="checkbox" />
```

This should work correctly. If it's not, verify that the `watch()` call returns a boolean and the conditional rendering properly evaluates truthiness.

## Implementation Details

### File to modify
- `/frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

### Changes required

1. **Replace hardcoded conditionals** in both Period 1 and Period 2 sections:
   - Change `{false ? ...}` to use the appropriate `periodXWithdrawalType === "percentage"` check
   - Update input field IDs to match the selected type (`period_1_withdrawal_pct` vs `period_1_withdrawal_amount`)

2. **Verify Period 2 visibility**:
   - Ensure `{twoPeriodMode && ...}` properly wraps the entire Period 2 panel
   - Confirm the checkbox state synchronizes with the conditional rendering

3. **Update input field IDs and register targets**:
   ```tsx
   // When percentage selected:
   id="retirement_spending.period_1_withdrawal_pct"
   {...register("retirement_spending.period_1_withdrawal_pct", { valueAsNumber: true })}
   
   // When amount selected:
   id="retirement_spending.period_1_withdrawal_amount"
   {...register("retirement_spending.period_1_withdrawal_amount", { valueAsNumber: true })}
   ```

### Testing considerations

- Toggle withdrawal type and verify the correct input field appears/disappears
- Test both Period 1 and Period 2 independently
- Verify checkbox enables/disables Period 2 panel
- Ensure form submission includes correct fields based on selection
- Validate that percentage values are stored as decimals (backend expects this)
