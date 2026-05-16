# Retirement Income vs Expenses Calculation Design

## Overview

This document describes the calculation logic for the "Income vs Expenses" chart in the retirement calculator, following **Option 3** - where income represents inflows and expenses represent outflows.

---

## Definition Summary

| Category | What It Includes |
|----------|------------------|
| **Income** | Social Security, Pensions, Rental Income (inflows) |
| **Expenses** | Portfolio withdrawals + debt/liabilities (outflows) |
| **Net Income** | `income - expenses` |

---

## Calculation Logic

### 1. Pre-Retirement Years (current_age ≤ age < retirement_age)

- **Income**: 
  - Social Security (if claiming age reached)
  - Pensions (if starting age reached)
  - Rental income (while properties generate income)
  
- **Expenses**:
  - Portfolio withdrawals = 0 (no withdrawals before retirement)
  
- **Net Income** = `income - 0` = `income`

### 2. Post-Retirement Years (age ≥ retirement_age)

#### Single Period Mode
- **Income**: Same as pre-retirement (SS, pensions, rentals)
- **Expenses**: 
  - Portfolio withdrawal based on strategy:
    - If `spending_mode == "four_pct_rule"`: `portfolio_balance × 4%`
    - If custom percentage: `portfolio_balance × withdrawal_pct / 100`
    - If fixed amount: `first_year_expenses` (inflation-adjusted)
- **Net Income** = `income - portfolio_withdrawal`

#### Two Period Mode
- **Income**: Same as pre-retirement (SS, pensions, rentals)
- **Expenses**:
  - **Period 1** (`period_1_start_age ≤ age ≤ period_1_end_age`):
    - Portfolio withdrawal based on `period_1_withdrawal_pct` or amount
  - **Period 2** (`period_2_start_age ≤ age ≤ period_2_end_age`):
    - Portfolio withdrawal based on `period_2_withdrawal_pct` or amount
- **Net Income** = `income - current_period_withdrawal`

---

## Inflation Adjustment

When `adjust_for_inflation == true`:
- Withdrawal amounts are adjusted annually by the inflation rate
- Formula: `withdrawal_amount × (1 + inflation_rate)`
- Income sources may also be adjusted if they have COLA (Cost of Living Adjustment)

---

## API Response Structure

```typescript
interface RetirementResponse {
  age: number[];
  portfolio_balance: number[];
  
  // Income from various sources (inflows)
  income: number[];  // SS + pensions + rentals
  
  // Expenses (outflows)
  expenses: number[];  // Portfolio withdrawals + debt payments
  
  // Net cash flow
  net_income: number[];  // income - expenses
  
  success: boolean;
  final_balance: number;
  avg_balance: number;
  max_balance: number;
  min_balance: number;
}
```

---

## Examples

### Example 1: Single Period, 4% Rule
- Current portfolio: $500K
- Withdrawal rate: 4%
- Social Security: $24K/year (already retired)
- No other income/expenses

| Age | Portfolio | Income | Expenses (4%) | Net |
|-----|-----------|--------|---------------|-----|
| 66 | $500,000 | $24,000 | $20,000 | $4,000 |
| 67 | $513,000* | $24,720* | $20,680* | $4,040 |

\* After 5.5% return and inflation adjustment

### Example 2: Two Period Mode
- Period 1 (62-65): 3% withdrawal rate
- Period 2 (66+): 4% withdrawal rate
- Social Security: $24K/year from age 62
- Portfolio starts at $500K

| Age | Portfolio | Income | Expenses | Net |
|-----|-----------|--------|----------|-----|
| 62 | $500,000 | $24,000 | $15,000 (3%) | $9,000 |
| 63 | $509,750* | $24,600* | $15,443* | $9,157 |
| 66 | $535,000 | $25,800 | $21,400 (4%) | $4,400 |



## Implementation Tasks

### Backend (`/backend/fourpercent/calculation/retirement_v4.py`)

- [ ] Update `_calculate_yearly_income()` to NOT include portfolio withdrawal
- [ ] Modify projection loop to track `portfolio_withdrawal` separately
- [ ] Set `expenses[year] = portfolio_withdrawal`
- [ ] Set `income[year] = social_security + pensions + rentals`
- [ ] Apply inflation adjustments when configured

### Frontend (`/frontend/src/app/(main)/dashboard/retirement/_components/RetirementCharts.tsx`)

- [ ] Update chart to show income vs expenses clearly
- [ ] Add legend explaining what each category represents
- [ ] Ensure tooltip displays both values correctly

---

## Testing Scenarios

1. **Single period, no other income**: Income = 0, Expenses = withdrawal amount
2. **SS + portfolio withdrawal**: Income = SS, Expenses = withdrawal
3. **Two period mode**: Verify correct rates applied in each period
4. **Inflation adjustment**: Verify withdrawals increase with inflation when enabled
