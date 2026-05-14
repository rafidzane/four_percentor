## Why

The Withdrawal Strategy toggle switch (Switch component) in the RetirementForm does not properly update the form state when toggled between "Amount" and "Percentage" modes. Users can click the switch but the underlying `period_X_withdrawal_type` field doesn't change, making it impossible to actually select a withdrawal type.

## What Changes

- Fix the Switch component's `onCheckedChange` handler in Period 1 and Period 2 sections
- Ensure form state updates correctly when switching between percentage and amount withdrawal types
- Preserve all existing functionality including conditional input field display

**No breaking changes** - only fixes non-functional toggle behavior.

## Capabilities

### New Capabilities
None - this is a bug fix for existing functionality.

### Modified Capabilities
None - no spec-level requirements changing, just implementation fix.

## Impact

**Affected code:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx` (lines 107 and 189)

**Dependencies:**
- `@radix-ui/react-switch` (shadcn/ui Switch component)
- `react-hook-form` (form state management)

**API changes:** None
