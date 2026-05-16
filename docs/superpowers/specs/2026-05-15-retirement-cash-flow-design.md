# Retirement Calculator: Annual Cash Flow Design

**Date:** 2026-05-15  
**Status:** Ready for implementation planning  
**File to modify:** `backend/fourpercent/calculation/retirement_v4.py`

---

## Overview

Refactor `_calculate_yearly_income` function in the retirement calculator to compute **annual cash flow** instead of just non-withdrawal income sources. The new calculation will be:

```
Yearly Cash Flow = Portfolio Returns + Contributions - Withdrawals
```

This provides a complete picture of yearly financial flow throughout the entire projection period.

---

## Current State

The `_calculate_yearly_income` function currently:
- Calculates only Social Security, pensions, and rental income
- Does NOT include portfolio returns or withdrawals
- Is called each year but doesn't reflect true annual cash position

Resulting calculation: `net_income = annual_income - annual_expenses`
- Where `annual_income` = non-withdrawal sources only
- And `annual_expenses` = withdrawal amounts

This is semantically confusing because it doesn't represent actual yearly cash flow.

---

## New Behavior

### Function Signature Change

```python
def _calculate_yearly_income(
    self, 
    age: int, 
    portfolio_balance: float,
    is_retired: bool
) -> float:
```

**Parameters:**
- `age`: Current year's age
- `portfolio_balance`: Starting balance for this year
- `is_retired`: Whether we're in retirement phase

### Calculation Logic

**Pre-retirement years:**
```python
returns = portfolio_balance * pre_retirement_return
cash_flow = returns + current_contribution
```

**Post-retirement years:**
```python
returns = portfolio_balance * post_retirement_return
withdrawal = calculate_withdrawal(age, portfolio_balance)  # based on spending config
cash_flow = returns - withdrawal
```

### Output Changes

**New output field:** `net_cash_flow` (renamed from `income`)

The existing `expenses` field is kept for transparency:
- `net_cash_flow`: Total cash in/out for the year
- `expenses`: Withdrawal amount (display purpose only)

---

## Implementation Details

### Integration Points

1. **In `_calculate_yearly_income`**:
   - Add portfolio balance as parameter
   - Calculate returns based on retirement status
   - Apply contribution growth for pre-retirement years
   - Handle withdrawal calculation for post-retirement years

2. **In `calculate_projection` loop**:
   ```python
   # Store balance before any changes for this year's return calculation
   starting_balance = portfolio_balance
   
   if year < retirement_age:
       # Pre-retirement logic
       portfolio_balance += current_contribution
       portfolio_balance *= (1 + pre_retirement_return)
   else:
       # Post-retirement logic
       portfolio_balance -= current_spending
       portfolio_balance *= (1 + post_retirement_return)
   
   # Calculate cash flow using STARTING balance
   annual_cash_flow = self._calculate_yearly_income(
       year, starting_balance, year >= retirement_age
   )
   ```

3. **Update return type**:
   - Change `incomes` array → `net_cash_flows` array in response

### Edge Cases to Handle

1. **Zero or negative balance**: Return 0 if portfolio is depleted
2. **First year**: Use current portfolio balance as starting point
3. **Contribution growth**: Apply growth each pre-retirement year
4. **Spending calculation consistency**: Must match the withdrawal logic in `calculate_projection`

---

## Testing Considerations

1. **Pre-retirement years**: Verify cash flow equals returns + contribution
2. **Post-retirement years**: Verify cash flow equals returns - withdrawal
3. **Depletion scenario**: When balance reaches 0, cash flow should be 0 or negative
4. **Inflation adjustments**: Spending (withdrawals) should increase with inflation

---

## Benefits

- More accurate picture of yearly financial position
- Easier to understand "cash in hand" after returns and withdrawals
- Consistent calculation across all years (not just pre/post retirement)
- Clearer semantics: cash flow vs expenses vs net

---

## Next Steps

1. Write unit tests for `_calculate_yearly_income` with various scenarios
2. Update `calculate_projection` to use new function signature
3. Rename output field from `income` to `net_cash_flow`
4. Verify backward compatibility with frontend charting
