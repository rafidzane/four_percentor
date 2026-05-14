## Context

The retirement dashboard has a "Calculate Projection" button that should:
1. Collect all form inputs (Personal Info, Portfolio Assets, Withdrawal Strategy, Income Sources, Real Estate)
2. POST to backend API at `/fourpercent/api/v4/retirement`
3. Receive simulation results
4. Update charts and numerical results on the UI

The hook `useRetirementCalculation` handles the API call with automatic debounce-based recalculation and manual trigger via `calculateNow()`.

Current state: Form components exist and call `calculateNow()` on button click, but there are no tests verifying this end-to-end flow works correctly.

## Goals / Non-Goals

**Goals:**
1. Verify the "Calculate Projection" button triggers `useRetirementCalculation.calculateNow()`
2. Confirm the backend API endpoint receives correct data shape
3. Validate simulation results update all chart components (portfolio balance, income vs expenses)
4. Ensure numerical results display correctly (success rate, final/avg/max/min balances)

**Non-Goals:**
1. Testing individual field validation - covered by existing form tests
2. Integration with real backend server - use mocked API responses
3. Performance/load testing - focus on correctness of integration

## Decisions

**Test Approach:**
- Use React Testing Library for component interaction tests
- Mock the `fetch` API using `msw` (Mock Service Worker) or Jest mocks
- Test both successful and error scenarios

**What to Test:**

1. **Button Click Handler:**
   - Clicking "Calculate Projection" calls `calculateNow()`
   - Loading spinner appears during calculation
   - Button is disabled while loading

2. **API Call Verification:**
   - Correct endpoint URL is called (`/fourpercent/api/v4/retirement`)
   - POST method is used with correct headers
   - Data shape matches `FormData` interface (timeline, current_assets, portfolio_allocation, retirement_spending)

3. **Results Update:**
   - `RetirementResponse` data populates chart components
   - Success rate displays correctly
   - Portfolio balance chart updates with new data points
   - Income vs Expenses chart shows updated lines

4. **Error Handling:**
   - Error banner appears on API failure
   - Retry button resets error state
   - User-friendly error messages display (connection failure, invalid response)

**Mock Strategy:**
- Mock `fetch` to return successful `RetirementResponse`
- Mock one failure case for error path testing
- Test with minimal valid form data set

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Tests may be brittle due to React Query caching | Use direct hook testing, bypass React Query layer |
| Form data structure is complex and nested | Create fixture data matching the actual form defaults |
| Chart components have internal state that may not reflect API results | Test chart props are updated with result data |

## Migration Plan

**Implementation Steps (see `tasks.md`):**
1. Create integration test file for `RetirementForm`
2. Add mock fixtures for valid form data and expected responses
3. Write tests for button click → API call flow
4. Write tests for results display updates
5. Write error path tests

**Rollback:**
- Tests are additive - no existing code modified
- Remove test file if issues arise
- No database or config changes required
