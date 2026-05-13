# Withdrawal Strategy Section Fix

**Date:** 2026-05-11  
**Status:** Approved

## Problem Statement

The Withdrawal Strategy section in the retirement calculator has two issues:

1. **Switches not active**: The Amount/Pct toggle switches for Period 1 and Period 2 don't work because `period_1_withdrawal_type` and `period_2_withdrawal_type` have no default values in the form schema
2. **Unused Spending Mode section**: The "Spending mode" dropdown (4% Rule vs Manual Withdrawal) is present but not needed since withdrawal type now controls behavior

## Solution Overview

### 1. Remove Spending Mode Section
- Delete the entire spending mode UI from `WithdrawalStrategySection.tsx`
- Keep `spending_mode` field in schema for backward compatibility (no breaking changes)

### 2. Fix Switch Component Behavior  
- Add default values to form schema: `period_1_withdrawal_type: "percentage"`, `period_2_withdrawal_type: "percentage"`
- Ensure switches properly control input visibility via React Hook Form state

### 3. Input Validation Rules
| Withdrawal Type | Field Name | Min | Max | Step | Display Format |
|-----------------|------------|-----|-----|------|----------------|
| Amount | `period_X_withdrawal_amount` | 0 | ∞ | 100 | Dollar amount (e.g., $50,000) |
| Pct | `period_X_withdrawal_pct` | 0 | 20 | 0.5 | Percentage (e.g., 4%) |

## Implementation Plan

### Files to Modify

**1. `/frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`**
- Remove spending mode section HTML (approximately lines 36-52)
- Keep all other sections intact (Period 1, Period 2, inflation checkbox)

**2. `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx`**
- Add default values for `period_1_withdrawal_type: "percentage"` and `period_2_withdrawal_type: "percentage"` to `defaultValues.retirement_spending`

### Changes Summary

| File | Change Type | Lines Affected |
|------|-------------|----------------|
| WithdrawalStrategySection.tsx | Remove HTML section | ~15 lines deleted |
| RetirementForm.tsx | Add default values | 2 lines added |

## Technical Details

### Switch Wiring (Already Working)
The existing Switch components are already wired correctly:
```typescript
<Switch
  id="retirement_spending.period_1_withdrawal_type"
  checked={period1WithdrawalType === "percentage"}
  onCheckedChange={(checked) => setValue("retirement_spending.period_1_withdrawal_type", checked ? "percentage" : "amount")}
/>
```

The only issue is the missing default value, which causes `period1WithdrawalType` to be `undefined` initially.

### Conditional Input Display (Already Working)
Existing conditional rendering handles input switching:
```typescript
{false ? <input for percentage /> : <input for amount />}
```
This will work once the switch values have proper defaults.

## Risk Assessment

**Low Risk:**
- Only removing UI elements, no logic changes
- Default value addition is minimal and safe
- No backend API changes required
- Existing tests should pass without modification

**Verification Steps:**
1. Build frontend successfully (no TypeScript errors)
2. Verify spending mode section removed from UI
3. Test Period 1 switch toggles between amount/percentage inputs
4. Test Period 2 switch works identically
5. Verify percentage input accepts 0-20 range
6. Verify period 2 checkbox still controls visibility

## Success Criteria

- [ ] Spending mode dropdown no longer visible in Withdrawal Strategy section
- [ ] Switches are active and toggle immediately between Amount/Pct modes
- [ ] Amount input shows dollar field with $100 increments
- [ ] Percentage input shows numeric field with 0.5% increments, max 20%
- [ ] No console errors or TypeScript warnings
- [ ] Form submission works correctly with new default values
