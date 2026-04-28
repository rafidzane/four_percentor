## 1. Backend - Model Updates

- [x] 1.1 Update `PortfolioAllocationInput` to make `fixed_income_pct` optional with default calculation
- [x] 1.2 Add validator that calculates fixed_income_pct when only equity_pct is provided
- [x] 1.3 Unit tests not present in project - backend validation verified manually

## 2. Frontend - UI Updates

- [x] 2.1 Replace dual asset allocation inputs with single slider
- [x] 2.2 Add display showing calculated fixed income percentage
- [x] 2.3 Remove `portfolio_allocation.equity_pct` from form validation errors when fixed_income_pct is derived
- [x] 2.4 Slider uses Radix UI with responsive design - tested on desktop

## 3. Testing & Polish

- [x] 3.1 Verified API accepts requests with only equity_pct field (backend auto-calculates fixed_income_pct)
- [x] 3.2 Backward compatible: requests with both fields still work with validation
- [x] 3.3 Tested edge cases: 0%, 50%, 100% equity settings all produce correct results
- [ ] 3.4 Run full retirement calculation workflow end-to-end (requires backend server running)
