## ADDED Requirements

### Requirement: Portfolio withdrawals counted as income
When using percentage-based withdrawal strategies (4% rule, custom percentages, or two-period modes), the annual portfolio withdrawal amount MUST be included in the `income` array for each year.

#### Scenario: Four percent rule mode - income includes withdrawal
- **WHEN** user selects `spending_mode="four_pct_rule"`
- **AND** current age >= retirement age (post-retirement phase)
- **THEN** `income[year]` should include the portfolio withdrawal amount (4% of portfolio balance)
- **AND** total income = Social Security + pensions + rental income + portfolio withdrawal

#### Scenario: Custom percentage mode - income includes withdrawal
- **WHEN** user sets custom `withdrawal_pct` value
- **AND** current age >= retirement age (post-retirement phase)
- **THEN** `income[year]` should include the portfolio withdrawal amount (`withdrawal_pct`% of portfolio balance)

#### Scenario: Two-period mode - period 1 income includes withdrawal
- **WHEN** user enables `two_period_mode=true`
- **AND** current age is within `period_1_start_age` to `period_1_end_age`
- **THEN** `income[year]` should include portfolio withdrawal amount (`period_1_withdrawal_pct`% of balance)

#### Scenario: Two-period mode - period 2 income includes withdrawal
- **WHEN** user enables `two_period_mode=true`
- **AND** current age is within `period_2_start_age` to `period_2_end_age`
- **THEN** `income[year]` should include portfolio withdrawal amount (`period_2_withdrawal_pct`% of balance)

### Requirement: Pre-retirement shows zero portfolio withdrawal income
During the accumulation phase (current age < retirement age), portfolio withdrawal income must be zero since no withdrawals are being made.

#### Scenario: Accumulation phase - no withdrawal income
- **WHEN** current age < retirement age
- **THEN** `income[year]` should NOT include any portfolio withdrawal amount
- **AND** all income should come only from Social Security, pensions, and rental properties (if applicable)

### Requirement: Income calculation includes all sources
Total annual income must be the sum of all income sources including portfolio withdrawals.

#### Scenario: Complete income calculation
- **WHEN** calculating `income[year]` in post-retirement phase
- **THEN** `income[year] = social_security + pensions + rental_income + portfolio_withdrawal_amount`
- **AND** `net_income[year] = income[year] - expenses[year]`

## MODIFIED Requirements

None - this is adding missing functionality without changing existing requirements.
