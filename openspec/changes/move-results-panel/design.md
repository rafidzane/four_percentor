## Context

The retirement dashboard currently has the results panel positioned on the left-hand side of the screen. This layout creates a poor user experience because:

1. The main retirement projection charts are not always visible when users are analyzing their results
2. Users need to scroll or navigate away from the main visualization to access detailed results
3. The information hierarchy isn't optimized for quick analysis

The dashboard needs to be reorganized to improve accessibility and visual flow.

## Goals / Non-Goals

**Goals:**
- Move the results panel from the left to the top right position above the retirement projection
- Maintain all existing functionality while improving UI organization
- Ensure responsive design works correctly on different screen sizes
- Improve visual hierarchy and user experience for retirement analysis

**Non-Goals:**
- Changing core retirement calculation logic or formulas
- Modifying API endpoints or data models
- Adding new features beyond the layout change
- Changing color schemes or fundamental styling elements

## Decisions

1. **Component Layout**: Reorganize the dashboard components to place results panel at the top right corner above the projection charts.

2. **CSS Positioning**: Use Tailwind CSS utility classes for responsive positioning rather than absolute positioning to ensure compatibility across different screen sizes.

3. **Responsive Design**: Implement a mobile-friendly version where the panel stacks vertically on smaller screens.

4. **Component Structure**: Maintain the existing component hierarchy but adjust their arrangement in the JSX structure.

## Risks / Trade-offs

- [User Experience Regression] → Mitigation: Conduct thorough testing across multiple screen sizes and user scenarios
- [Performance Impact] → Mitigation: Use lightweight CSS positioning rather than complex layout libraries
- [Accessibility Concerns] → Mitigation: Ensure proper keyboard navigation and screen reader support after repositioning