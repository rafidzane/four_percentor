## Context

The retirement dashboard currently has a suboptimal layout where calculation results are displayed below the retirement projection charts. This creates an inefficient user experience because users need to scroll down to see results after running calculations, and the main visualization is not immediately visible when viewing results.

## Goals / Non-Goals

**Goals:**
- Restructure the dashboard into a two-column layout with inputs on the left and charts on the right
- Position calculation results panel above the retirement projection charts in the right column
- Maintain all existing functionality while improving UI organization
- Ensure responsive design works correctly on different screen sizes
- Improve visual hierarchy to prioritize key retirement projections

**Non-Goals:**
- Changing core retirement calculation logic or formulas
- Modifying API endpoints or data models
- Adding new features beyond the layout change
- Changing color schemes or fundamental styling elements

## Decisions

1. **Component Layout**: Reorganize the dashboard components to place results panel at the top of the right column above the charts.

2. **CSS Positioning**: Use Tailwind CSS utility classes for responsive positioning rather than absolute positioning to ensure compatibility across different screen sizes.

3. **Responsive Design**: Implement a mobile-friendly version where the layout stacks vertically on smaller screens.

4. **Component Structure**: Maintain the existing component hierarchy but adjust their arrangement in the JSX structure.

## Risks / Trade-offs

- [User Experience Regression] → Mitigation: Conduct thorough testing across multiple screen sizes and user scenarios
- [Performance Impact] → Mitigation: Use lightweight CSS positioning rather than complex layout libraries
- [Accessibility Concerns] → Mitigation: Ensure proper keyboard navigation and screen reader support after repositioning