## Context

The retirement dashboard page requires two key visualizations: "Portfolio Value Over Time" and "Income vs Expenses". These charts need calculated data from the backend that represents the full retirement simulation process. The existing retirement calculation engine already supports these computations, but there's no API endpoint to access this data in a structured format suitable for charting.

## Goals / Non-Goals

**Goals:**
- Create a new API endpoint that returns structured data for retirement dashboard visualizations
- Support both "Portfolio Value Over Time" and "Income vs Expenses" chart requirements
- Integrate with existing retirement calculation services
- Maintain consistency with existing data formats and conventions

**Non-Goals:**
- Implement new retirement calculation logic (already exists)
- Change the frontend UI components (they're already designed)
- Add authentication or user context (placeholder for now)

## Decisions

1. **API Endpoint Location**: The endpoint will be `/api/retirement/dashboard` to align with existing retirement API structure
2. **Data Structure**: Return data in time-series format suitable for charting libraries:
   - Portfolio Value Over Time: Array of {year, portfolioValue} objects
   - Income vs Expenses: Array of {year, income, expenses} objects
   - Summary: {successRate, finalPortfolioValue, yearsOfRetirement}
3. **Service Integration**: Reuse existing retirement calculation service with appropriate input parameters
4. **Response Format**: Return JSON data that matches charting library expectations (e.g., Chart.js or D3.js)

## Risks / Trade-offs

- [Data consistency] → Ensure the data returned is consistent with what's displayed in frontend calculations
- [Performance] → The retirement calculation can be computationally intensive, so we'll need to optimize where possible
- [Memory usage] → For long retirement periods, large datasets may be generated - consider pagination or sampling if needed

## Migration Plan

1. Create the new API endpoint with appropriate routing
2. Integrate with existing retirement calculation service
3. Add necessary input validation and error handling
4. Test with sample data to ensure chart-ready output format

## Implementation Status

The API endpoint `/api/retirement/dashboard` has been implemented in `backend/fourpercent/api/retirement_api.py`. It:

- Accepts all standard retirement planning inputs via POST request
- Returns structured data suitable for dashboard visualizations:
  - Portfolio value over time data (array of {year, portfolioValue})
  - Income vs expenses data (array of {year, income, expenses})
  - Summary data with key metrics

## Open Questions

- Should we return all years of calculation or just a subset for performance?
- What are the specific data requirements for each chart type (min/max values, step sizes)?