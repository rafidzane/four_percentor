## Context

The retirement dashboard has a layout issue where content in panels is not properly contained within their designated areas. The main problem occurs in the form section that contains personal information, portfolio assets, contributions, withdrawal strategy, income sources, and real estate sections. When users scroll through these panels, the panels don't maintain proper alignment or containment, causing visual confusion.

## Goals / Non-Goals

**Goals:**
- Implement proper panel sizing to contain all content within their designated areas
- Ensure consistent scrolling behavior where panels move together as a unit
- Fix overflow issues in input forms and chart containers
- Maintain responsive design across different screen sizes
- Preserve existing functionality while improving layout

**Non-Goals:**
- Changing the core retirement calculation logic or algorithms
- Modifying any backend API endpoints or data models
- Adding new features beyond layout improvements

## Decisions

1. **CSS Grid and Flexbox Approach**: Use CSS Grid for the main dashboard layout with flexbox for individual panel content to ensure proper containment and alignment.

2. **Panel Height Management**: Implement a fixed height calculation for panels that accounts for the form elements, charts, and spacing while ensuring content doesn't overflow.

3. **Scroll Container Strategy**: Apply scroll containers to specific sections (like the main form) rather than relying on overall page scrolling, allowing individual panel contents to scroll independently without affecting other panels.

4. **Responsive Design Considerations**: Ensure that all changes work well on different screen sizes using Tailwind's responsive utilities.

## Risks / Trade-offs

- **Risk**: Changes might affect existing responsive behavior on smaller screens → **Mitigation**: Test thoroughly across mobile, tablet, and desktop views
- **Risk**: Potential performance impact from additional CSS rules → **Mitigation**: Keep styles minimal and optimized with Tailwind utility classes
- **Risk**: Layout changes may require extensive testing of form interactions → **Mitigation**: Create a test plan for all input fields and form validation

## Migration Plan

1. Implement the new layout structure in the dashboard component
2. Test on various screen sizes to ensure responsiveness
3. Verify that all forms, charts, and inputs work correctly
4. Run existing tests to ensure no regressions
5. Deploy with proper version control and rollback plan

## Open Questions

- Should we implement a scrollable container for the entire form section or individual panels?
- Are there specific accessibility requirements for scroll behavior that need to be considered?