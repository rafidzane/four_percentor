# Withdrawal Strategy Section Fix - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unused spending mode dropdown and fix switch components in the retirement withdrawal strategy section
**Architecture:** Minimal changes - remove UI element, add default values to form schema
**Tech Stack:** Next.js 14+, React Hook Form, shadcn/ui Switch component

---

## Files Summary

| File | Action | Reason |
|------|--------|--------|
| `frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx` | Modify | Remove spending mode section HTML |
| `frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx` | Modify | Add default values for withdrawal_type fields |

---

### Task 1: Read Current State of WithdrawalStrategySection

**Files:**
- Read: `frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

**Steps:**

- [ ] **Step 1: Identify spending mode section to remove**

Locate the HTML block that contains the "Spending mode" dropdown with options for "4% Rule" and "Manual Withdrawal Amount". This is approximately lines 36-52 in the file.

Expected visual marker in code:
```html
<div className="space-y-1 mb-3">
  <label htmlFor="retirement_spending.spending_mode"...>Spending mode</label>
  <div className="flex items-center gap-1">
    <select id="retirement_spending.spending_mode"...>
      <option value="four_pct_rule">4% Rule (safe withdrawal rate)</option>
      <option value="manual_withdrawal">Manual Withdrawal Amount</option>
```

- [ ] **Step 2: Verify current structure**

Confirm the file has:
- Spending mode section (to be removed)
- Inflation checkbox
- Period 1 configuration with Switch component
- "Configure Period 2 spending" checkbox  
- Period 2 configuration (conditional, with Switch component)

---

### Task 2: Remove Spending Mode Section from WithdrawalStrategySection

**Files:**
- Modify: `frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

- [ ] **Step 1: Delete spending mode section HTML**

Remove the entire block containing the "Spending mode" dropdown. This includes:
- The label for "Spending mode"
- The select element with options for "four_pct_rule" and "manual_withdrawal"
- The tooltip wrapping the info icon button next to it

Keep everything else intact (inflation checkbox, Period 1, Period 2).

Expected result after deletion:
```typescript
// First section should now be the inflation checkbox directly
return (
  <div data-slot="card"...>
    <div data-slot="card-header"...>Withdrawal Strategy</div>
    <div data-slot="card-content"...>
      {/* Inflation checkbox is now first */}
      <div className="flex items-center space-x-2 mb-3">
        <input type="checkbox" {...register("retirement_spending.adjust_for_inflation")}/>
        <span className="text-xs">Adjust for inflation</span>
```

- [ ] **Step 2: Verify file structure**

Ensure the remaining sections are properly formatted with correct spacing and no orphaned HTML tags.

---

### Task 3: Add Default Values to RetirementForm Schema

**Files:**
- Modify: `frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx`

- [ ] **Step 1: Locate defaultValues for retirement_spending**

Find the `defaultValues.retirement_spending` object (approximately lines 123-134). Current structure includes:
```typescript
retirement_spending: {
  spending_mode: "four_pct_rule",
  first_year_expenses: 0,
  withdrawal_pct: 4,
  age_range_start: 62,
  age_range_end: 92,
  adjust_for_inflation: true,
  two_period_mode: false,
  period_1_start_age: 62,
  period_1_end_age: 65,
  period_1_withdrawal_pct: 4,
  // ... missing withdrawal_type fields
```

- [ ] **Step 2: Add default values for withdrawal_type fields**

Add two new properties to the `retirement_spending` object:
```typescript
period_1_withdrawal_type: "percentage",
period_2_withdrawal_type: "percentage",
```

Complete updated section should look like:
```typescript
retirement_spending: {
  spending_mode: "four_pct_rule",
  first_year_expenses: 0,
  withdrawal_pct: 4,
  age_range_start: 62,
  age_range_end: 92,
  adjust_for_inflation: true,
  two_period_mode: false,
  period_1_start_age: 62,
  period_1_end_age: 65,
  period_1_withdrawal_pct: 4,
  period_1_withdrawal_type: "percentage",  // NEW
  period_2_start_age: 66,
  period_2_end_age: 92,
  period_2_withdrawal_pct: 4,
  period_2_withdrawal_type: "percentage",  // NEW
},
```

---

### Task 4: Verify TypeScript Types Are Compatible

**Files:**
- Read: `frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx` (SpendingData interface)

- [ ] **Step 1: Check SpendingData interface definition**

Locate the `interface SpendingData` definition (approximately lines 56-70). Verify it includes the new fields:
```typescript
interface SpendingData {
  spending_mode: "four_pct_rule" | "manual_withdrawal";
  first_year_expenses: number;
  withdrawal_pct: number;
  age_range_start: number;
  age_range_end: number;
  adjust_for_inflation: boolean;
  two_period_mode: boolean;
  period_1_start_age?: number;
  period_1_end_age?: number;
  period_1_withdrawal_pct?: number;
  period_1_withdrawal_type?: "percentage" | "amount";  // Should already exist
  period_1_withdrawal_amount?: number;
  period_2_start_age?: number;
  period_2_end_age?: number;
  period_2_withdrawal_pct?: number;
  period_2_withdrawal_type?: "percentage" | "amount"; // Should already exist
  period_2_withdrawal_amount?: number;
}
```

- [ ] **Step 2: Confirm optional fields accept our defaults**

The `?` suffix on `period_X_withdrawal_type` means they're optional - adding them to defaultValues is safe and valid TypeScript.

---

### Task 5: Build and Verify No Errors

**Files:**
- Run build command for frontend

- [ ] **Step 1: Run frontend build**

```bash
cd /home/rafid/devel/four_percentor/frontend && npm run build
```

Expected result:
- Build completes successfully
- No TypeScript errors
- Output shows "Compiled successfully" and route listing

- [ ] **Step 2: Verify output**

Check that the build output includes `/dashboard/retirement` as a dynamic route with no warnings.

---

### Task 6: Manual Testing Checklist (For User Verification)

**Files:**
- N/A - UI testing in browser

- [ ] **Step 1: Navigate to retirement dashboard**

Open the application and navigate to `/dashboard/retirement`.

- [ ] **Step 2: Verify spending mode removed**

Confirm there is NO "Spending mode" dropdown with options for "4% Rule" or "Manual Withdrawal Amount".

- [ ] **Step 3: Test Period 1 switch**

In the "Period 1" section:
- The "Type" field should show a Switch component between "Amount" and "Pct" labels
- By default, it should be in "Pct" position (switch to right)
- Click to toggle left → should show dollar amount input field
- Click to toggle right → should show percentage input field

- [ ] **Step 4: Test Period 2 switch**

Check the "Configure Period 2 spending" checkbox is unchecked by default. Check it to reveal Period 2 section, then verify the same switch behavior as Period 1.

- [ ] **Step 5: Test input validation**

When Pct is selected in either period:
- Input should accept values from 0 to 20
- Step increment should be 0.5%

When Amount is selected:
- Input should accept dollar amounts with $100 increments

---

## Self-Review Checklist

**Spec Coverage:**
- [x] Remove spending mode dropdown → Task 2
- [x] Add default values for withdrawal_type → Task 3
- [x] Verify TypeScript compatibility → Task 4
- [x] Build verification → Task 5
- [x] Manual testing criteria → Task 6

**Placeholder Scan:**
- No "TBD", "TODO", or vague instructions found
- All steps have concrete file paths and code examples
- Commands are complete with expected outputs

**Type Consistency:**
- `period_1_withdrawal_type` and `period_2_withdrawal_type` used consistently throughout
- Values `"percentage"` and `"amount"` match the type definition
- No conflicting field names or types

---

## Implementation Notes

### Why This Approach Works

The Switch components are already wired correctly in WithdrawalStrategySection.tsx:
```typescript
<Switch
  checked={period1WithdrawalType === "percentage"}
  onCheckedChange={(checked) => setValue("retirement_spending.period_1_withdrawal_type", checked ? "percentage" : "amount")}
/>
```

The only issue was that `period1WithdrawalType` started as `undefined`, making the switch appear inactive. Adding default values fixes this without touching the Switch logic.

### Risk Assessment: LOW
- Only removing UI (Task 2) and adding two default values (Task 3)
- No backend changes required
- Existing conditional rendering logic already handles input switching
- TypeScript interface already supports these fields as optional

---

Plan complete and saved to `docs/superpowers/plans/2026-05-11-withdrawal-strategy-fix-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
