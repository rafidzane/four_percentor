## Why

The current retirement calculator outputs portfolio balance projections, but users need actionable financial insights to make informed decisions. Key missing metrics include:

1. **Nest Egg Needed**: How much is required based on annual expenses and safe withdrawal rate (e.g., $120K/yr ÷ 4% = $3M needed)
2. **Portfolio Runway**: How many years money will last using the formula: `log(1 - (Nest Egg × r / Annual Withdrawal)) / log(1 + r)`
3. **Net Annual Cash Flow**: Year-by-year calculation: `Total Income - Total Expenses - Taxes`
4. **Future Value Projection**: Using `FV = PV × (1 + r)^n + PMT × ((1 + r)^n - 1) / r`

Additionally, all assets become income when withdrawn from savings/retirement accounts - this should be reflected in the income calculation.

## What Changes

- **Backend** (`/backend/fourpercent/calculation/retirement_v4.py`):
  - Add `Nest_Egg_Needed`: Calculated as `Annual_Expenses / Safe_Withdrawal_Rate`
  - Add `Portfolio_Runway_Years`: Calculate using compound interest formula with real return rate
  - Add `Net_Annual_Cash_Flow`: Per-year calculation of income - expenses
  - Add `Years_To_Depletion`: Estimate when portfolio runs out (if applicable)
  - Update response to include these metrics alongside existing balance data

- **API Contract**:
  - Extend `RetirementResponse` model with new financial metrics
  - No breaking changes to existing fields

## Capabilities

### New Capabilities
- `financial-metrics-calculation`: Enhanced financial calculations including nest egg needed, portfolio runway, net cash flow
- `asset-to-income-conversion`: Portfolio withdrawals treated as income (already in progress via fix-income-calculation)

### Modified Capabilities
- None - this adds new output metrics without changing existing behavior

## Impact

**Backend:**
- `/backend/fourpercent/calculation/retirement_v4.py`:
  - Add new metric calculations after portfolio projection loop
  - Update `RetirementResponse` model with additional optional fields

**API Contracts:**
- Extended response includes financial metrics
- Backward compatible - existing frontend will continue to work

**Frontend:**
- Can display additional insights to users (nest egg % achieved, runway estimates)
- May need UI updates for new metrics displays
