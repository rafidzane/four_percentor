## Why

When a user clicks "Calculate Projection" in the retirement dashboard, it should:
1. Call the backend API with the current input values
2. Receive simulation results
3. Update all charts and numerical results on the frontend

Currently, there's no verification that this full flow works correctly end-to-end. Users need confidence that their projection calculations are accurate and reliable.

## What Changes

- **Add integration tests** for the Calculate Projection button click flow
- **Verify backend API endpoint** is called with correct parameters from form inputs
- **Confirm chart updates** - retirement projection charts render new data after calculation
- **Validate result displays** - numerical results (income, expenses, balances, success rate) update correctly

## Capabilities

### New Capabilities
- `calculate-projection-full-flow`: End-to-end test coverage for the calculate projection feature, verifying backend API calls and frontend updates work together seamlessly.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing -->
*None - this is a new capability*

## Impact

**Backend:**
- No code changes required - existing `/api/simulator/projection` endpoint should be tested
- Verify request/response schemas are correctly defined in Pydantic models

**Frontend:**
- Verify `RetirementForm` component calls the correct API endpoint on calculate button click
- Confirm React Query cache invalidation/update triggers chart re-renders
- Test that all form inputs map to correct API parameters

**Tests:**
- Add integration tests under `/tests/integration/`
- Mock backend response or use test database
- Verify DOM updates for charts and result numbers after calculation
