## Why

The current retirement results display only shows 4 basic metrics:
- Final Balance
- Average Balance
- Max Balance
- Min Balance

Retirement planners need more comprehensive information to make informed decisions, including:
- Success probability (chance of portfolio lasting throughout retirement)
- Year of depletion (when money runs out, if applicable)
- Monthly income equivalent
- Visual chart of balance over time
- Income vs expenses breakdown

## What Changes

- Add success probability and year of depletion to results summary
- Integrate an interactive line chart for portfolio balance visualization
- Add a secondary chart showing income vs expenses over time
- Include breakdown metrics like total contributions, total withdrawals, inflation impact

## Capabilities

### New Capabilities
- `retirement-chart-portfolio-balance`: Interactive chart showing portfolio balance over retirement years
- `retirement-chart-income-expenses`: Chart comparing income and expenses throughout retirement
- `retirement-success-metrics`: Display success probability and year of depletion

### Modified Capabilities
- `retirement-results-display`: Enhanced to show comprehensive metrics

## Impact

- **Frontend**: New chart components using Recharts or similar library
- **Backend**: Already provides required data fields (`success_probability`, `year_of_depletion`)
- **Performance**: Chart rendering may add slight load time for complex projections
