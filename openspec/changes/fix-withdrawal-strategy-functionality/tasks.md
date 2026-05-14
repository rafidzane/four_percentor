# Implementation Tasks

## Task 1: Fix Period 1 withdrawal type conditional rendering
**File**: `frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

**Description**: Replace the hardcoded `{false ? ...}` condition with a dynamic check based on the form's `period_1_withdrawal_type` value.

**Steps**:
1. Find the Period 1 Value input section (around line 106-135)
2. Replace `{false ? (` with `{period1WithdrawalType === "percentage" ? (`
3. Ensure percentage input uses `register("retirement_spending.period_1_withdrawal_pct")`
4. Ensure amount input uses `register("retirement_spending.period_1_withdrawal_amount")`

**Verification**: Toggle the Period 1 switch and verify the correct input field appears.

---

## Task 2: Fix Period 2 withdrawal type conditional rendering
**File**: `frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

**Description**: Apply the same fix to Period 2 section within the `{twoPeriodMode && ...}` block.

**Steps**:
1. Find the Period 2 Value input section (around line 183-210)
2. Replace `{false ? (` with `{period2WithdrawalType === "percentage" ? (`
3. Ensure percentage input uses `register("retirement_spending.period_2_withdrawal_pct")`
4. Ensure amount input uses `register("retirement_spending.period_2_withdrawal_amount")`

**Verification**: Enable Period 2 mode, toggle withdrawal type, and verify the correct input field appears.

---

## Task 3: Verify Period 2 visibility control
**File**: `frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx`

**Description**: Confirm the "Configure Period 2 spending" checkbox properly toggles the Period 2 panel.

**Steps**:
1. Locate the Period 2 checkbox (around line 147-160)
2. Verify it uses `{...register("retirement_spending.two_period_mode")}`
3. Check that the entire Period 2 block is wrapped in `{twoPeriodMode && (...)}`
4. Test by toggling the checkbox and verifying panel appears/disappears

**Note**: If this already works, no code changes needed - document as verified.

---

## Task 4: Update default values to match new field structure
**File**: `frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx`

**Description**: Ensure default form values include all withdrawal type fields explicitly.

**Current defaults** (from line 72-89):
```typescript
period_1_withdrawal_pct: 4,
period_1_withdrawal_type: "percentage",  // Missing!
period_2_withdrawal_pct: 4,
period_2_withdrawal_type: "percentage",  // Missing!
```

**Required defaults**:
```typescript
period_1_withdrawal_pct: 4,
period_1_withdrawal_amount: 0,           // Add for completeness
period_1_withdrawal_type: "percentage",  // Explicitly set
period_2_withdrawal_pct: 4,
period_2_withdrawal_amount: 0,           // Add for completeness
period_2_withdrawal_type: "percentage",  // Explicitly set
```

---

## Task 5: Test complete workflow

**Test cases to verify**:

1. **Percentage toggle (Period 1)**:
   - Start with default percentage mode
   - Toggle to amount - verify dollar input appears
   - Enter $50,000 and confirm it saves correctly
   - Toggle back to percentage - verify percent input appears

2. **Amount toggle (Period 1)**:
   - Start in amount mode
   - Toggle to percentage - verify percentage input appears
   - Enter 4% and confirm it saves correctly

3. **Period 2 visibility**:
   - Verify Period 2 panel is hidden by default
   - Check "Configure Period 2 spending"
   - Verify all Period 2 inputs appear
   - Uncheck the box
   - Verify Period 2 panel disappears

4. **Independent configuration**:
   - Set Period 1 to percentage (4%)
   - Set Period 2 to amount ($60,000)
   - Verify both settings persist correctly
   - Submit form and check backend receives correct fields

5. **Validation**:
   - Enter invalid percentage (>100) and verify error shows
   - Enter negative amount and verify error shows
   - Verify form can't submit with invalid data

---

## Task 6: Run verification commands

```bash
# Check TypeScript compiles without errors
npm run build

# Run linter
npm run lint

# If tests exist for this component, run them
npm test -- WithdrawalStrategySection
```
