## Context

The withdrawal strategy section in the retirement calculator currently has:
- **Period 1**: Complete set of inputs - Start Age, End Age, Type toggle (Amount/Percentage), Value input
- **Period 2**: Partial implementation - only Start/End ages visible; Type and Value sections exist but may have rendering or binding issues

The backend `SpendingStrategyInput` model already has all the required fields for Period 2 including:
- `period_2_start_age`, `period_2_end_age`
- `period_2_withdrawal_type`: "percentage" | "amount"
- `period_2_withdrawal_pct` or `period_2_withdrawal_amount`

The frontend `RetirementForm.tsx` and `WithdrawalStrategySection.tsx` have partial support but Period 2 UI is incomplete/broken.

## Goals / Non-Goals

**Goals:**
1. Display complete Period 2 input section matching Period 1 structure
2. Implement Start Age, End Age inputs for Period 2
3. Implement Type toggle (Amount/Percentage) with same UI pattern as Period 1
4. Implement Value input that dynamically switches between amount ($) and percentage (%)
5. Ensure form validation works for all Period 2 fields

**Non-Goals:**
- No backend changes needed - model already supports all fields
- No API contract changes - existing endpoints accept the full data structure
- No new charts or visualizations required

## Decisions

1. **UI Pattern Consistency**: Use identical UI pattern for Period 2 as Period 1 - same toggle switch component, same input styling, same validation rules

2. **Conditional Rendering**: Only show Period 2 section when `two_period_mode` is enabled (controlled by the main toggle checkbox)

3. **Form Values Integration**: Continue using React Hook Form's `watch()` for reactive value changes and `Controller` for proper form binding

4. **Validation**: Apply same validation rules to Period 2 as Period 1:
   - Ages must be >= 18, <= 100
   - Percentage values: >= 0, <= 100
   - Amount values: >= 0

## Risks / Trade-offs

- **Risk**: If Period 2 end age is less than start age, simulation may fail
  - **Mitigation**: Add form-level validation to check `period_2_end_age > period_2_start_age`

- **Risk**: Users might configure overlapping periods (e.g., Period 1 ends at 65, Period 2 starts at 60)
  - **Mitigation**: Add cross-field validation between Period 1 and Period 2 age ranges

- **Risk**: Switching between percentage/amount may lose user input if not handled carefully
  - **Mitigation**: Keep both fields in form state but only display the active one; use `watch()` to detect type changes and show appropriate input

## Migration Plan

**Backend:**
- No backend changes required

**Frontend:**
1. Update `RetirementForm.tsx` defaultValues to include Period 2 defaults
2. Fix `WithdrawalStrategySection.tsx` to display complete Period 2 inputs matching Period 1 structure
3. Add validation for cross-period age range consistency
4. Test with various configuration scenarios
