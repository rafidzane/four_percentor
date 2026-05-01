## Why

The current retirement dashboard has a suboptimal layout where the calculation results are displayed below the retirement projection charts. This creates an inefficient user experience because:

1. Users need to scroll down to see results after running calculations
2. The main projection visualization is not immediately visible when viewing results
3. The information hierarchy doesn't prioritize the most important visualizations

The dashboard needs a restructure to improve usability by placing the calculation results in a more accessible location above the retirement projection charts.

## What Changes

- Restructure the retirement dashboard page into a two-column layout
- Left column: All input forms and configuration options
- Right column: Main retirement projection charts with results panel positioned above them
- Move calculation results from below charts to above charts in right column
- Maintain all existing functionality while improving UI organization

## Capabilities

### New Capabilities
- `dashboard-layout-update`: Defines the updated UI layout for the retirement dashboard
- `results-panel-positioning`: Specifies how the results panel should be positioned in the UI

### Modified Capabilities
- `retirement-dashboard-ui`: The dashboard UI now has a different component arrangement

## Impact

- Frontend components in `/frontend/` will be modified to change panel positioning
- CSS styling files will need updates for new layout positioning
- Component hierarchy and React component structure will be adjusted
- User experience will improve with better information organization