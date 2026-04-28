## ADDED Requirements

### Requirement: Portfolio Balance Chart
Display an interactive line chart showing portfolio balance throughout retirement years.

#### Scenario: Successful projection
- **WHEN** retirement simulation completes with success = true
- **THEN** chart shows positive balance over entire retirement period
- **AND** line has green gradient fill

#### Scenario: Depleted projection
- **WHEN** portfolio runs out before end of retirement
- **THEN** chart shows balance reaching zero at year of depletion
- **AND** displays vertical marker at depletion age

### Requirement: Success Metrics Display
Show key success metrics in a summary section.

#### Scenario: Displaying basic stats
- **WHEN** results are available
- **THEN** display shows: Final Balance, Average Balance, Max Balance, Min Balance

#### Scenario: Displaying success indicators
- **WHEN** simulation includes success probability
- **THEN** show: Success Probability (e.g., "85% chance of success")
- **AND** if applicable: Year of Depletion

### Requirement: Income vs Expenses Chart
Visualize annual income and expenses throughout retirement.

#### Scenario: Normal cash flow
- **WHEN** income exceeds expenses in most years
- **THEN** chart shows green bars for income, red/orange for expenses
- **AND** net positive trend is visible

#### Scenario: Break-even scenario
- **WHEN** income equals expenses over time
- **THEN** charts clearly show matching trends with minimal variance
