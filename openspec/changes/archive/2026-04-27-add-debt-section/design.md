## Context

Users often have multiple debt obligations that affect their retirement readiness. The current model only tracks assets and contributions, potentially giving an incomplete picture of financial health.

## Goals / Non-Goals

**Goals:**
- Track all major debt types (mortgage, auto, credit cards, student loans)
- Calculate net worth with debt subtraction
- Show debt-free projection timeline
- Display debt-to-income ratio for retirement cash flow analysis

**Non-Goals:**
- Debt payoff strategy optimization recommendations
- Refinancing advice
- Credit score considerations

## Decisions

1. **Debt types to track**:
   - Mortgage (current balance, interest rate, remaining term)
   - Auto loan(s) (balance, monthly payment, term remaining)
   - Credit card debt (total balance, avg APR)
   - Student loans (balance, monthly payment, income-driven plan flag)
   - Other personal loans

2. **Net worth calculation**:
   ```
   Net Worth = Assets - Liabilities
   Where Liabilities = mortgage + auto + credit cards + student loans + other
   ```

3. **Results display**: Show:
   - Total debt outstanding
   - Monthly debt service required
   - Debt-to-income ratio (in retirement)
   - Estimated year when all debts are paid off

## Debt Input Structure

```
debt:
  mortgage: {
    balance: number,
    interest_rate: number,
    monthly_payment: number,
    remaining_months: number
  }
  auto_loans: [
    { balance, interest_rate, monthly_payment, remaining_months } x up to 2
  ]
  credit_cards: {
    total_balance: number,
    avg_apr: number,
    min_payment_pct: number
  }
  student_loans: {
    balance: number,
    monthly_payment: number,
    income_driven_plan: boolean
  }
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users forgetting some debts | Provide examples for each debt type |
| Overcomplicating form with many fields | Group by debt category, use collapsible sections |
