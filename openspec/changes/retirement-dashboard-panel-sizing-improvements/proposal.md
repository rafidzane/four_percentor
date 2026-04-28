## Why

The retirement dashboard panel layout has issues where content overflow and scroll behavior are not properly contained within their designated areas. This causes panels to extend beyond their intended boundaries, making the user experience confusing and potentially causing visual glitches when scrolling through different sections of the retirement calculator.

## What Changes

- Adjust the CSS styling and container sizing for dashboard panels to ensure all content remains properly contained
- Implement proper overflow handling for input forms and chart containers
- Improve scroll behavior so that panels move up together when scrolling
- Ensure consistent height calculations across different sections of the dashboard

## Capabilities

### New Capabilities
- `dashboard-panel-sizing`: Specification for consistent panel sizing and containment in retirement dashboard
- `retirement-dashboard-layout`: Layout requirements for the retirement calculator UI

### Modified Capabilities
- `retirement-calculator-ui`: The user interface requirements for the retirement calculator have been updated to include proper panel containment and scroll behavior

## Impact

- Affects frontend code in `/frontend/src/app/dashboard/retirement` directory
- Changes styling and layout in Next.js components
- May impact existing dashboard responsiveness on different screen sizes
- Requires testing across multiple browsers and devices