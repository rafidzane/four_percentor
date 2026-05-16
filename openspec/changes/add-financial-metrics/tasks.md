## 1. Backend - Update Response Model

- [ ] 1.1 Add optional fields to `RetirementResponse` model:
  - nest_egg_needed: Optional[float]
  - portfolio_runway_years: Optional[int]
  - success_percentage: Optional[float]
  - avg_net_cash_flow: Optional[float]

## 2. Backend - Add Metric Calculations

- [ ] 2.1 Calculate Nest Egg Needed after projection loop (expenses / 0.04)
- [ ] 2.2 Calculate Real Return Rate (post-retirement return - inflation rate)
- [ ] 2.3 Calculate Portfolio Runway using compound interest formula
- [ ] 2.4 Calculate Success Percentage (final_balance / nest_egg_needed * 100)
- [ ] 2.5 Calculate Average Net Cash Flow across all years

## 3. Backend - Verify Calculations

- [ ] 3.1 Test with $100K expenses: verify nest_egg = $2.5M
- [ ] 3.2 Test runway formula produces reasonable estimates
- [ ] 3.3 Verify success_percentage calculation accuracy
- [ ] 3.4 Verify avg_net_cash_flow matches sum(years)/count

## 4. Integration Testing

- [ ] 4.1 Run existing test suite to ensure no regressions
- [ ] 4.2 Test with user's example input from issue
- [ ] 4.3 Verify all new metrics appear in response JSON
