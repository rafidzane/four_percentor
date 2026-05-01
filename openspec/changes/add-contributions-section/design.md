## Context

The retirement planning calculator needs to support user contributions to their portfolio over time. Currently, the Personal Information Card doesn't include fields for annual contributions, which limits accurate retirement projections.

## Goals / Non-Goals

**Goals:**
- Add a "Contributions" section to the Personal Information Card in the retirement planning flow
- Include fields for "Yearly contribution" and "Yearly contribution increase %"
- Ensure these values are properly captured and used in retirement calculations
- Maintain existing functionality while extending the input form

**Non-Goals:**
- Modify the core retirement calculation algorithms
- Add complex contribution scheduling (e.g., irregular contributions)
- Implement contribution tax implications or employer matching features

## Decisions

1. **Form Location**: The Contributions section will be added to the Personal Information Card, alongside existing fields like assets and timeline information.

2. **Data Types**: 
   - Yearly contribution: Integer value in cents (stored as monetary amount)
   - Yearly contribution increase %: Decimal value (0.03 = 3%)

3. **Default Values**:
   - Yearly contribution: $10,000 (1000000 cents)
   - Yearly contribution increase %: 3% (0.03)

4. **Input Components**: 
   - Yearly contribution field will be a numeric input with step=500
   - Contribution increase % field will be a numeric input with step=0.5

## Risks / Trade-offs

- [Data validation] → Ensure contribution amounts are positive and reasonable values to prevent calculation errors
- [User experience] → Make it clear that these are annual contributions, not lump sum amounts
- [Backend integration] → Need to ensure the new fields are properly handled in all retirement planning endpoints