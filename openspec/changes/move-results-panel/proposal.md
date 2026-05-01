## Why

The current retirement dashboard has the results panel positioned on the left-hand side, which creates a suboptimal user experience. Users want to see the main projection charts and key metrics at the top of the screen while having access to detailed results in a more accessible location. Moving the results panel to the top right above the retirement projection will improve usability by:

1. Keeping the main projection visualization visible at all times
2. Providing better access to detailed results without scrolling or navigating away from the main chart
3. Improving visual flow and information hierarchy for users who want to analyze their retirement projections

## What Changes

- Modify the frontend component layout to move the results panel from left to top right position
- Update CSS styling and positioning to accommodate the new layout
- Ensure responsive design works correctly on different screen sizes
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