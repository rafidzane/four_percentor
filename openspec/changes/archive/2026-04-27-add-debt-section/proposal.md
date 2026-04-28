## Why

The current retirement calculator focuses on assets (portfolio, 401k, IRA) but does not account for existing debt obligations. Debt significantly impacts:
1. **Net worth calculations** - Liabilities reduce available equity
2. **Debt service requirements** - Monthly payments affect cash flow needs in retirement
3. **Debt payoff strategies** - Users may want to pay off debt before retiring

Without tracking debt, users may overestimate their financial readiness for retirement.

## What Changes

- Add Debt section with fields for:
  - Mortgage balance and term remaining
  - Auto loans (balance, monthly payment, term)
  - Credit card debt
  - Student loans
  - Other personal loans
- Show total debt vs net worth ratio
- Calculate debt-to-income ratio in retirement

## Capabilities

### New Capabilities
- `retirement-debt-tracking`: Track all outstanding debt obligations
- `retirement-debt-ratios`: Calculate debt-to-net-worth and debt-to-income ratios

### Modified Capabilities
- `retirement-net-worth-calculation`: Subtract debt from assets for accurate net worth

## Impact

- **Frontend**: Add Debt section to form, display ratio metrics in results
- **Backend**: May need debt field addition to input models
- **Results**: Enhanced summary showing debt-free year projection
