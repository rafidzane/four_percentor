## Why

The retirement dashboard page at http://localhost:3000/dashboard/retirement contains two key visualization components: "Portfolio Value Over Time" and "Income vs Expenses". Currently, there is no backend API that supports these visualizations. Users can input their retirement data but cannot retrieve the calculated data needed to populate these charts. This change will create a backend API endpoint that processes user inputs and returns the calculated data required for both graphs.

## What Changes

- Create a new API endpoint at `/api/retirement/dashboard` 
- Implement backend logic to process all retirement planning inputs
- Return data structured for two key visualizations:
  - Portfolio Value Over Time (timeline of portfolio growth/decline)
  - Income vs Expenses (comparison of income streams vs withdrawal amounts over time)
- Support the full retirement calculation pipeline from input to visualization-ready output

## Capabilities

### New Capabilities
- `retirement-dashboard-data`: API endpoint that returns structured data for retirement dashboard visualizations
- `retirement-projection-charts`: Specification for how retirement projections should be structured for charting

### Modified Capabilities
- `retirement-planning-inputs`: Updated to include all necessary parameters for dashboard calculations

## Impact

- Backend: Adds new `/api/retirement/dashboard` endpoint in the backend API
- Database: No changes required - uses existing models and calculation engine
- Frontend: Provides data structure needed for two key retirement visualizations
- API: New endpoint returns calculated data formatted for charting libraries