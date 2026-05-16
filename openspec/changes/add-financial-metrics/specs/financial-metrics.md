## ADDED Requirements

### Requirement: Nest Egg Needed Calculation
The system MUST calculate and return the target portfolio needed based on annual expenses and a safe withdrawal rate of 4%.

#### Scenario: Calculate nest egg for $100K annual expenses
- **WHEN** user's annual expenses are $100,000
- **THEN** `nest_egg_needed` = $100,000 ÷ 0.04 = $2,500,000

### Requirement: Portfolio Runway Calculation  
The system MUST calculate how many years the portfolio will last using the compound interest formula.

#### Scenario: Calculate runway with known parameters
- **WHEN** initial balance = $2M, withdrawal rate = 4%, real return = 2%
- **THEN** use formula: `n = log(1 - (PV × r / PMT)) / log(1 + r)`
- **AND** `portfolio_runway_years` is returned as integer

### Requirement: Success Percentage Calculation
The system MUST calculate what percentage of required nest egg the user has achieved.

#### Scenario: Calculate success percentage
- **WHEN** `nest_egg_needed` = $2,500,000 and final portfolio balance = $3,000,000
- **THEN** `success_percentage` = ($3M / $2.5M) × 100 = 120%

### Requirement: Average Net Cash Flow
The system MUST calculate average net cash flow across all projection years.

#### Scenario: Calculate avg net cash flow
- **WHEN** projection has 30 years of data with varying net_income values
- **THEN** `avg_net_cash_flow` = sum(net_income) / number_of_years

## MODIFIED Requirements

### Requirement: Portfolio Withdrawals as Income
When using percentage-based withdrawal strategies, the portfolio withdrawal amount must be included in the annual income calculation.

#### Scenario: 4% rule includes withdrawals as income
- **WHEN** `spending_mode="four_pct_rule"` and post-retirement phase
- **THEN** `income[year]` includes withdrawal amount (4% of balance)
- **AND** `net_income[year] = income[year] - expenses[year]`
