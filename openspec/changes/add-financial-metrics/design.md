## Context

The retirement calculator currently outputs:
- Portfolio balance over time
- Income and expenses per year  
- Success/failure status (portfolio > 0 throughout)

Missing financial insights that users need:
1. **Nest Egg Needed**: Target portfolio based on annual expenses ÷ safe withdrawal rate
2. **Portfolio Runway**: Years until depletion using compound interest formula
3. **Net Annual Cash Flow**: Year-by-year income - expenses (already partially calculated)
4. **Success Metrics**: Percentage of nest egg achieved, runway estimates

The `fix-income-calculation` change already ensures portfolio withdrawals are counted as income.

## Goals / Non-Goals

**Goals:**
1. Add financial metrics calculation after portfolio projection
2. Calculate Nest Egg Needed based on user's annual expenses and 4% SWR
3. Calculate Portfolio Runway using real return rate formula
4. Add optional fields to response model without breaking changes

**Non-Goals:**
- Don't modify existing portfolio projection logic
- Don't change Monte Carlo simulation approach
- Don't add tax calculations (too complex for this scope)

## Decisions

1. **Safe Withdrawal Rate**: Use 4% as default for nest egg calculation (standard Bengen/Trinity study)
2. **Runway Formula**: Use compound interest inverse formula: `n = log(1 - (PV × r / PMT)) / log(1 + r)`
3. **Real Return Rate**: Calculate as post-retirement return minus inflation rate
4. **Optional Fields**: Add new metrics to response as optional fields for backward compatibility

## Risks / Trade-offs

- **Risk**: Different users may use different SWR assumptions (3%, 4%, 5%)
  - **Mitigation**: Document that we use 4% as standard; users can calculate their own if needed

- **Risk**: Runway calculation assumes constant withdrawal rate and return
  - **Mitigation**: This is an estimate - actual Monte Carlo provides better probabilities

## Migration Plan

**Backend Changes:**
1. In `calculate_projection()`, after the projection loop, add metric calculations:
   - Calculate annual expenses from first year (or use withdrawal amounts)
   - Nest Egg Needed = Annual Expenses / 0.04
   - Real Return Rate = Post-retirement return - inflation rate
   - Portfolio Runway = formula using real return and withdrawal amounts

2. Update `RetirementResponse` model with new optional fields:
   - nest_egg_needed: Optional[float]
   - portfolio_runway_years: Optional[int]  
   - success_percentage: Optional[float] (nest egg achieved / nest egg needed)
   - avg_net_cash_flow: Optional[float]

**Testing:**
1. Verify nest egg calculation matches expected (expenses ÷ 0.04)
2. Verify runway formula produces reasonable estimates
3. Ensure backward compatibility with existing frontend
