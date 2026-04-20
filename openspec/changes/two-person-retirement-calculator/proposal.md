## Why

The existing retirement calculator only handles a single person's financial situation. Many households have two income earners (husband and spouse) whose combined finances need to be planned together for retirement. This change adds comprehensive two-person retirement planning capabilities while maintaining backward compatibility with single-person calculations.

## What Changes

- Add comprehensive two-person retirement calculator with separate inputs for husband and spouse
- Support different retirement ages for each person
- Include both individuals' Social Security benefits in projections
- Handle combined household assets (liquid + illiquid)
- Maintain single-person calculator as a simplified option or deprecated feature
- Update API to support dual-person calculation parameters

## Capabilities

### New Capabilities
- `two-person-retirement-planning`: Core capability for joint retirement planning with separate inputs for husband and spouse, including different ages, retirement ages, Social Security benefits, and combined asset totals
- `api-v3-retirement-endpoint`: Enhanced API endpoint supporting multi-person input parameters and returning aggregated projections

### Modified Capabilities
- None - new capability without modifying existing spec behavior

## Impact

**Backend:**
- Add new calculation engine to handle two-person projections
- Update API endpoints to accept husband/spouse parameter pairs
- Return combined results (total household income, assets, Social Security)

**Frontend:**
- Create new two-person calculator component with side-by-side input sections
- Add toggles for same/different retirement age scenarios
- Implement results aggregation showing household totals

**API:**
- `/fourpercent/api/v3/retirement/calculate` - New endpoint accepting dual-person parameters
- Existing v1/v2 endpoints remain unchanged (backward compatibility)
