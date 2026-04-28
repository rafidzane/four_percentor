## Why

The current retirement calculator does not account for individual health status, which significantly impacts:
1. **Longevity estimates** - Healthier individuals typically live longer, requiring longer portfolio projections
2. **Healthcare costs** - Chronic conditions or poor health increase medical expenses
3. **Medicare eligibility timing** - Health issues may affect when Medicare becomes the primary insurer

Without these inputs, retirement plans may be overly optimistic (underestimating longevity) or inaccurate (misestimating healthcare needs).

## What Changes

- Add health status input field (excellent, good, average, fair, poor)
- Add expected lifespan override (currently inferred from actuarial tables)
- Add chronic conditions checklist (diabetes, heart disease, etc.)
- Add estimated annual healthcare cost escalation based on health

## Capabilities

### New Capabilities
- `retirement-health-status-input`: Collect user health status and chronic conditions
- `retirement-longevity-override`: Allow manual adjustment to planned retirement horizon

### Modified Capabilities
- `retirement-projection-duration`: Extend timeline based on health-adjusted longevity estimates

## Impact

- **Frontend**: Add health assessment section in Personal Information or new dedicated section
- **Backend**: May need health-adjusted mortality tables or multiplier factors
- **UX**: Users with health concerns can adjust their plan accordingly
