## ADDED Requirements

### Requirement: Debt Input Fields
The system must accept input for major debt types.

#### Scenario: User enters mortgage information
- **WHEN** user inputs mortgage balance, interest rate, and remaining term
- **THEN** system stores liability value and calculates monthly payment if not provided

#### Scenario: User enters credit card debt
- **WHEN** user inputs total credit card balance
- **THEN** system applies estimated minimum payment (typically 2-3% of balance)

### Requirement: Total Debt Calculation
The system must calculate total liabilities from individual debts.

#### Scenario: Multiple debt sources
- **WHEN** user enters mortgage, auto loans, and student loans
- **THEN** system sums all debt amounts for total liabilities

### Requirement: Net Worth with Debt
Show net worth accounting for outstanding liabilities.

#### Scenario: Displaying net worth
- **WHEN** results are shown
- **THEN** display includes: Assets, Liabilities, Net Worth (Assets - Liabilities)

### Requirement: Debt-Free Year Projection
Estimate when all debt will be paid off.

#### Scenario: Calculating debt payoff timeline
- **WHEN** retirement projection is calculated
- **THEN** show estimated year when last debt obligation is satisfied
