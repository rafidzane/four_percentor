## Context

The `WithdrawalStrategySection` component uses a Switch (slider toggle) to allow users to switch between "Amount" (fixed dollar withdrawal) and "Percentage" (percentage of portfolio) withdrawal strategies for both Period 1 and Period 2.

**Current implementation (buggy):**
- The Switch component has `checked={periodXWithdrawalType === "percentage"}`
- On change, it calls `setValue("retirement_spending.period_X_withdrawal_type", checked ? "percentage" : "amount")`
- The issue: When the user clicks the switch, the visual state may update but the form value doesn't properly persist due to how the `checked` prop is computed from the watched value

**Root cause analysis:**
The problem stems from the interaction between:
1. `watch("retirement_spending.period_X_withdrawal_type")` returning a stale value
2. The Switch component's internal state not being properly synced with react-hook-form
3. Potential timing issues where the `checked` prop is computed before `setValue` completes

## Goals / Non-Goals

**Goals:**
1. Fix the toggle switch to properly update form state when toggled
2. Maintain visual feedback (highlighted text for selected type)
3. Keep conditional input fields (amount vs percentage) working correctly

**Non-Goals:**
- Not changing the UI design or visual appearance
- Not modifying the underlying data model or field names
- Not affecting Period 1/Period 2 toggle logic

## Decisions

**Approach:** Use react-hook-form's `watch()` directly in a callback to get current values, then explicitly set the new value.

**Implementation plan:**
1. Replace the inline arrow function with a named handler function that:
   - Gets the current form values via `getValues()`
   - Computes the new withdrawal type based on the switch state
   - Calls `setValue()` with proper form path

2. Ensure `control` is properly passed and `watched` values are correctly accessed

3. Test both directions (Amount → Percentage and Percentage → Amount) for both periods

**Alternative considered:** Using a controlled Switch component with local state, but this would complicate synchronization with react-hook-form. The current uncontrolled approach with proper handlers is simpler.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Switch doesn't respond to clicks | Test with browser DevTools to verify `setValue` is being called |
| Form validation might fail after toggle | Verify form submission still works correctly |
| Visual flickering during switch | The change should be atomic - no flicker expected |

**No migration needed** - this is a pure bug fix within the same component.

## Open Questions

None - the issue is well-understood and has a clear fix path.
