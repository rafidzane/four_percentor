# Fix Retirement Income vs Expenses Calculation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the retirement calculation so that portfolio withdrawals are treated as expenses only, not as income. Income should only include Social Security, pensions, and rental income.

**Architecture:** Modify `_calculate_yearly_income()` to NOT accept withdrawal amount as a parameter. The projection loop will separately track `portfolio_withdrawal` as the expense while income is calculated from other sources only.

**Tech Stack:** Python 3.12+, FastAPI, Pydantic v2

---

## File Structure Mapping

| File | Action | Reason |
|------|--------|--------|
| `/backend/fourpercent/calculation/retirement_v4.py` | Modify | Update `_calculate_yearly_income()` signature and projection loop logic |
| `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementCharts.tsx` | Verify | Ensure charts display income vs expenses correctly |

---

## Task 1: Fix `_calculate_yearly_income()` method

**Files:**
- Modify: `backend/fourpercent/calculation/retirement_v4.py`

**Current behavior:** The method accepts `withdrawal_amount` parameter and adds it to total income.

**Required behavior:** The method should only calculate income from Social Security, pensions, and rental properties. No withdrawal amount should be included.

- [ ] **Step 1: Update `_calculate_yearly_income()` signature**

Remove the `withdrawal_amount` parameter from `_calculate_yearly_income()`. It should only take `age` as a parameter.

Current:
```python
def _calculate_yearly_income(self, age: int, withdrawal_amount: float = 0.0) -> float:
    """Calculate total yearly income for a given age"""
    total_income = 0.0

    # Add portfolio withdrawal as income (when in post-retirement phase and withdrawing)
    if withdrawal_amount > 0:
        total_income += withdrawal_amount
```

Required:
```python
def _calculate_yearly_income(self, age: int) -> float:
    """Calculate total yearly income for a given age"""
    total_income = 0.0

    # Calculate Social Security (simplified - would need actual COLA logic)
```

- [ ] **Step 2: Update projection loop to calculate expenses separately**

In the `calculate_projection()` method, modify the line that calls `_calculate_yearly_income()`:

Current:
```python
# Calculate income and expenses
annual_income = self._calculate_yearly_income(year, current_spending)
annual_expenses = current_spending
```

Required:
```python
# Calculate income (from SS, pensions, rentals only) and expenses (portfolio withdrawals)
annual_income = self._calculate_yearly_income(year)
annual_expenses = current_spending  # portfolio withdrawal amount
```

---

## Task 2: Update test to verify correct calculation

**Files:**
- Create: `backend/test_retirement_v4_income_expenses.py` (or add to existing test file)

**Test scenarios:**

1. **Single period mode - income should NOT include withdrawal**
   - Setup: $500K portfolio, 4% withdrawal, $24K Social Security
   - Expected: `income[retirement_year] == 24000`, `expenses[retirement_year] == 20000`

2. **Two period mode - different rates per period**
   - Setup: Period 1 (62-65) = 3%, Period 2 (66+) = 4%
   - Expected: Withdrawal amount changes based on age period

3. **Pre-retirement years - no withdrawals**
   - Setup: Age < retirement_age
   - Expected: `expenses[year] == 0` for all pre-retirement years

- [ ] **Step 1: Write test file**

Create a new test file with the above scenarios.

- [ ] **Step 2: Run tests to verify they fail**

The current implementation will pass withdrawal amount as income, so tests should fail initially.

- [ ] **Step 3: Implement changes from Task 1**

- [ ] **Step 4: Run tests again to verify they pass**

---

## Task 3: Verify frontend chart displays correctly

**Files:**
- Review: `frontend/src/app/(main)/dashboard/retirement/_components/RetirementCharts.tsx`

The chart already uses:
```typescript
income: result.income[index] ?? 0,
expenses: result.expenses[index] ?? 0,
```

This should work correctly once backend changes are complete.

- [ ] **Step 1: Verify chart displays income and expenses as separate bars**

- [ ] **Step 2: Test with sample data to confirm correct values**

---

## Task 4: Integration testing

**Files:**
- Run: Existing `backend/test_retirement_api.py`

- [ ] **Step 1: Start backend server**

```bash
cd /home/rafid/devel/four_percentor/backend
# Start uvicorn server
```

- [ ] **Step 2: Test with user's example input**

Use the JSON from the issue to verify:
- `income` array shows only SS/pensions/rentals (no withdrawal)
- `expenses` array shows withdrawal amounts
- `net_income = income - expenses`

---

## Summary

| Task | What | Expected Outcome |
|------|------|------------------|
| 1 | Update `_calculate_yearly_income()` | Method no longer adds withdrawal to income |
| 2 | Write and run tests | Tests verify correct behavior |
| 3 | Verify frontend chart | Chart displays correct values |
| 4 | Integration test | End-to-end works correctly |
