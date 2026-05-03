## Why

The retirement dashboard currently displays results at the bottom of the form component, which is not optimal from a user experience perspective. Users should see the key financial metrics immediately after submitting their inputs, positioned above the charts in the right column where they can easily compare their projections with visual data.

This change will improve the UX flow by showing results more prominently and in context with the chart visualization, making it easier for users to understand how their inputs affect retirement projections.

## What Changes

- Move the results display section from RetirementForm.tsx to RetirementCharts.tsx
- Position the results above the "Retirement Projection" chart in the right column
- Maintain all existing functionality and data flow
- Ensure proper formatting of financial values (3 decimal places)
- Keep all existing components working without breaking changes

## Capabilities

### New Capabilities
- `retirement-results-display`: Defines how retirement calculation results are displayed in the dashboard UI

### Modified Capabilities
- `retirement-dashboard-layout`: Updates the layout structure to position results above charts

## Impact

- **Frontend**: Modifies component structure and positioning in retirement dashboard
- **User Experience**: Improves information hierarchy by placing results above charts
- **Data Flow**: No changes to API or data processing logic
- **Components**: RetirementForm.tsx will no longer contain the results display section