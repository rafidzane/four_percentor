## Context

The current `PortfolioAllocationInput` model has both `equity_pct` and `fixed_income_pct` as required fields with a validator that enforces they sum to 100%. The UI currently shows two separate inputs (one slider, one number input), but the relationship between them is not intuitive.

## Goals / Non-Goals

**Goals:**
- Simplify asset allocation input to a single interactive control
- Eliminate validation errors caused by misaligned percentages
- Maintain backward compatibility with existing API clients

**Non-Goals:**
- Changing the underlying retirement calculation logic
- Adding new investment options (e.g., alternatives, cash allocation)

## Decisions

1. **Make fixed_income_pct optional**: In `PortfolioAllocationInput`, `fixed_income_pct` will be optional with a computed default of `100 - equity_pct`

2. **Update UI to single slider**: Replace the dual input (slider + number) with a single range slider showing equity % and auto-calculated fixed income %

3. **Preserve API backward compatibility**: The backend model accepts both fields, so existing clients can continue sending full data

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking existing clients that send only `fixed_income_pct` | Update frontend to always send `equity_pct`, add migration if needed |
| Users confused by automatic calculation | Add tooltip explaining the auto-calculation |
