## 1. Backend - Modify retirement calculation logic

- [x] 1.1 Add variable to track `withdrawal_amount` for each year during projection loop
- [x] 1.2 Modify `_calculate_yearly_income()` to accept and include portfolio withdrawal amount
- [x] 1.3 Update the income calculation in `calculate_projection()` to add withdrawal amounts

## 2. Backend - Verify correct behavior

- [ ] 2.1 Test single-period mode (four_pct_rule): verify income = withdrawal amount post-retirement
- [ ] 2.2 Test single-period mode (custom percentage): verify income = withdrawal amount post-retirement  
- [ ] 2.3 Test two-period mode period 1: verify income includes period_1_withdrawal_pct * balance
- [ ] 2.4 Test two-period mode period 2: verify income includes period_2_withdrawal_pct * balance

## 3. Frontend - Update if needed

- [ ] 3.1 Check retirement dashboard charts handle non-zero income correctly during retirement phase
- [ ] 3.2 Verify net_income display shows correct values (income - expenses)

## 4. Testing

- [ ] 4.1 Run existing test suite to ensure no regressions
- [ ] 4.2 Test with provided example from issue: verify income now shows withdrawal amounts
- [ ] 4.3 Verify total_income = SS + pensions + rentals + portfolio_withdrawal
