## Context

The current retirement calculator (`/frontend/src/app/(main)/dashboard/retirement/_components/RetirementCalculator.tsx`) supports single-person financial projections. It accepts parameters like current age, retirement age, liquid/illiquid assets, monthly contributions, and social security information for one individual.

The existing backend API endpoints are:
- `/fourpercent/api/v1/retirement/fourpercentor/calculate` (v1)
- `/fourpercent/api/v2/deep_retirement/deep_retirement/calculate` (v2)

Both endpoints only accept single-person parameters. The two-person retirement planning feature requires a new approach that aggregates multiple individuals' financial data into household-level projections.

## Goals / Non-Goals

**Goals:**
1. Support dual-person retirement planning with separate inputs for husband and spouse
2. Enable different retirement ages for each person (e.g., husband retires at 62, spouse at 67)
3. Combine both individuals' Social Security benefits into household income projections
4. Aggregate liquid and illiquid assets into combined household totals
5. Maintain backward compatibility with existing single-person calculator

**Non-Goals:**
1. Tax optimization strategies (beyond basic tax rate parameters)
2. Estate planning or inheritance calculations
3. Investment portfolio allocation recommendations
4. Monte Carlo simulations for dual-person scenarios (simplified approach only)

## Decisions

**1. Input Structure: Side-by-Side vs Combined**

*Decision:* Use side-by-side input sections for husband and spouse with option to copy/spouse data.

*Rationale:* Users can easily see and adjust each person's individual parameters while maintaining clarity about what belongs to whom. This approach is more intuitive than trying to manage separate fields in a single complex object.

**2. Retirement Age Handling**

*Decision:* Allow different retirement ages for each person by default, with optional "same retirement age" checkbox that syncs both values.

*Rationale:* In real households, partners often retire at different times (e.g., one leaves workforce early while other continues working). This provides maximum flexibility while keeping simple cases easy.

**3. Asset Aggregation**

*Decision:* Combine all liquid assets and all illiquid assets into household totals. Do not track individual allocations within the pool.

*Rationale:* Most households pool their assets for retirement planning purposes. Tracking exact ownership splits adds complexity without significant benefit for standard retirement projections.

**4. Social Security Calculation**

*Decision:* Calculate each person's Social Security benefit separately based on their own claiming age, then sum them for household total.

*Rationale:* Each individual's benefit is calculated based on their own earnings record and claiming decisions. The combined approach mirrors how households actually receive these benefits.

**5. API Versioning Strategy**

*Decision:* Create new v3 endpoint with dual-person parameters rather than modifying existing endpoints.

*Rationale:* Breaking changes to input/output structure would require frontend updates. New endpoint allows gradual migration and maintains compatibility for existing users.

## Risks / Trade-offs

**Risk:** Increased complexity in UI may overwhelm casual users  
**Mitigation:** Provide "basic mode" toggle that shows only essential fields, advanced options hidden behind expandable sections

**Risk:** Calculation logic becomes more complex with two separate retirement timelines  
**Mitigation:** Use the existing single-person calculation engine and aggregate results at each age milestone, projecting forward year-by-year

**Risk:** API response structure changes may break existing integrations  
**Mitigation:** New v3 endpoint with clear documentation; existing v1/v2 endpoints remain unchanged

**Risk:** Performance degradation with more complex calculations  
**Mitigation:** Use efficient array-based projections rather than recursive calculations; cache intermediate results where possible

## Migration Plan

1. Implement backend calculation logic for dual-person projections
2. Add new API endpoint at `/fourpercent/api/v3/retirement/calculate`
3. Create new frontend component `TwoPersonRetirementCalculator.tsx`
4. Add route at `/dashboard/retirement/two-person`
5. Update sidebar navigation to include link to new calculator
6. Deprecate old single-person page (optional: redirect or mark as legacy)

## Open Questions

1. Should the calculator support more than two people (e.g., blended families)?
2. How should survivor benefits be handled if one partner dies before the other?
3. Should spousal Social Security benefits (spouse's benefit based on partner's record) be included separately from individual benefits?
