## Why

The retirement dashboard currently has a scrolling issue where input forms are wrapped in scrollable divs that don't properly expand to accommodate their content. This causes problems with layout consistency and user experience, particularly when the form content exceeds the initial container height. Users cannot see all form fields without scrolling within the form section, which breaks the intended split-pane layout.

## What Changes

- Remove the fixed-height scrollable divs from the retirement dashboard input form
- Allow the parent container to expand based on content height
- Ensure both columns (inputs and charts) properly fill their parent containers
- Maintain responsive behavior while fixing overflow issues

## Capabilities

### New Capabilities
- `dashboard-layout-consistency`: Specification for consistent layout handling in dashboard components
- `retirement-dashboard-scrolling`: Requirements for proper scrolling behavior in retirement calculator UI

### Modified Capabilities
- `retirement-calculator-ui`: The user interface requirements for the retirement calculator have been updated to include better content containment and scrolling behavior

## Impact

- Affects frontend code in `/frontend/src/app/(main)/dashboard/retirement` directory
- Changes styling and layout in Next.js components
- May impact existing dashboard responsiveness on different screen sizes
- Requires testing across multiple browsers and devices