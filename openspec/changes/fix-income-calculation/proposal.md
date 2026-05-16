## Why

When using percentage-based withdrawal strategies (like the 4% rule), portfolio withdrawals should be counted as **income** since they represent money withdrawn from savings and investments. Currently, the backend only calculates income from Social Security, pensions, and rental properties - portfolio withdrawals are treated solely as expenses that reduce the balance, resulting in zero income values throughout the projection.

This is a financial modeling issue: In retirement planning, "income" should include all sources of cash flow available to the retiree, including withdrawals from savings accounts, 401(k)s, IRAs, and investment portfolios. When someone withdraws 4% of their $250,000 portfolio, that's $10,000 of income (money they can spend), not zero.

## What Changes

- **Backend** (`/backend/fourpercent/calculation/retirement_v4.py`):
  - Modify `_calculate_yearly_income()` to include portfolio withdrawals as income when using percentage-based withdrawal strategies
  - Portfolio withdrawal amount in each year should be added to income calculation alongside Social Security, pensions, and rental income

- **API Contract** (no breaking changes):
  - Response `income` array will now include portfolio withdrawal amounts for years when the retiree is drawing from savings
  - Total income = earned income (SS/pensions) + portfolio withdrawals + rental income

## Capabilities

### New Capabilities
- `portfolio-withdrawal-income`: Portfolio withdrawals under percentage-based strategies (4% rule, custom percentages) are included in annual income calculation
- `total-income-calculation`: Complete income calculation includes all sources: Social Security, pensions, rental properties, and portfolio withdrawals

### Modified Capabilities
- None - this adds missing functionality without changing existing behavior

## Impact

**Backend:**
- `/backend/fourpercent/calculation/retirement_v4.py`:
  - Modify `_calculate_yearly_income()` method to include portfolio withdrawal amount in total income
  - Need to track withdrawal amounts during projection loop and add them to income calculation

**API Contracts:**
- No breaking changes
- `income` array will now show non-zero values when using percentage-based withdrawal strategies
- `net_income` will be calculated correctly (income - expenses where income includes portfolio withdrawals)

**Frontend:**
- May need UI updates if charts or displays rely on income data being zero during accumulation phase
- Current behavior shows zero income until retirement, then portfolio withdrawals should appear

**Testing:**
- Verify income equals portfolio withdrawal amount in post-retirement years when using percentage-based strategy
- Verify total income = SS + pensions + rentals + portfolio withdrawals
- Verify net_income = total income - expenses (which equals portfolio withdrawal amount)
