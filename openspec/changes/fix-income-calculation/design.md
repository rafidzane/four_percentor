## Context

The current retirement calculation engine treats portfolio withdrawals as expenses only, which reduces the portfolio balance but doesn't contribute to the annual income calculation. This creates a misleading financial picture where:
- Pre-retirement: Income = 0 (correct - no withdrawals yet)
- Post-retirement: Income = 0, Expenses = withdrawal amount (incorrect - should be Income = withdrawal amount, Expenses = withdrawal amount)

In proper retirement accounting, when you withdraw $10,000 from your portfolio, that's $10,000 of income (money available to spend), and also $10,000 of expenses (money spent). The net effect is zero change to your bank account balance beyond the portfolio reduction.

## Goals / Non-Goals

**Goals:**
1. Include portfolio withdrawal amounts in the `income` array for years when withdrawals occur
2. Maintain backward compatibility - no breaking changes to API structure
3. Correctly calculate total income as sum of all sources (SS + pensions + rentals + portfolio)

**Non-Goals:**
- Don't change expense calculation logic
- Don't modify Monte Carlo simulation approach
- Don't change how balance is calculated (still balance -= expenses, then returns applied)

## Decisions

1. **Income Definition**: Portfolio withdrawal amount = income for that year. When you withdraw 4% of $250,000, that's $10,000 of income.

2. **Pre-retirement Phase**: No portfolio withdrawals should be counted as income (correct behavior - contributions are going in, not out)

3. **Post-retirement Phase**: Portfolio withdrawal amount = income. This applies to:
   - `four_pct_rule` mode
   - Custom percentage modes (`withdrawal_pct`)
   - Two-period modes (`period_1_withdrawal_pct`, `period_2_withdrawal_pct`)

4. **Implementation Location**: Modify the projection loop in `calculate_projection()` to track and store withdrawal amounts, then add them to income calculation

## Risks / Trade-offs

- **Risk**: Some users may expect income to only include earned income (SS/pensions), not portfolio withdrawals
  - **Mitigation**: This is standard retirement planning methodology; the current behavior was incorrect

- **Risk**: Frontend charts expecting zero income during accumulation phase might need adjustment
  - **Mitigation**: Pre-retirement years will still show zero portfolio withdrawal income; only post-retirement shows income

## Migration Plan

**Backend Changes:**
1. In `calculate_projection()`, store the `withdrawal_amount` for each year when in post-retirement phase
2. Pass this `withdrawal_amount` to `_calculate_yearly_income()` or calculate it separately and add to total income
3. The `income` array should now include portfolio withdrawal amounts for post-retirement years

**Testing:**
1. Verify income equals withdrawal amount for post-retirement years using percentage-based strategy
2. Verify income = SS + pensions + rentals + withdrawal_amount
3. Verify net_income = income - expenses (where expenses also equals withdrawal_amount, so net ≈ 0 from portfolio perspective)
