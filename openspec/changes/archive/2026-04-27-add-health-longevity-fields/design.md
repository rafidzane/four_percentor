## Context

Actuarial tables provide average life expectancy, but individual health can shift this by 5-10 years. A 65-year-old in excellent health may have a life expectancy of 87+ years, while someone with significant health issues may be at 80 or less. This variation significantly impacts retirement planning.

## Goals / Non-Goals

**Goals:**
- Allow users to input their health status for longevity estimation
- Enable override of planned retirement horizon (current default: 30 years)
- Collect chronic conditions that affect healthcare cost projections
- Adjust spending estimates based on health-related expenses

**Non-Goals:**
- Medical diagnosis or advice
- Integration with electronic health records
- Actuarial calculations from first principles

## Decisions

1. **Health status scale**: Use 5-point ordinal scale (excellent, good, average, fair, poor)
   - Maps to longevity multiplier: 0.92x through 1.12x
   - Average = 1.0x baseline

2. **Chronic conditions checklist**:
   - Diabetes
   - Heart disease
   - Cancer history
   - Cognitive decline concerns
   - Mobility limitations

3. **Healthcare cost escalation**: Allow users to specify if healthcare costs will rise faster than inflation (common for those with chronic conditions)

## Health Status Multipliers

| Status | Longevity Multiplier |
|--------|---------------------|
| Excellent | 1.12 (+4 years avg) |
| Good | 1.08 (+2.5 years avg) |
| Average | 1.00 (baseline) |
| Fair | 0.96 (-1 year avg) |
| Poor | 0.92 (-3 years avg) |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users underestimating health impact | Add educational text about health-longevity correlation |
| Privacy concerns with health data | Clearly state this is for calculation only, not stored |
| Overcomplicating form | Group health inputs in expandable section |
