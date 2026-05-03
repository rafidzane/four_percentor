## Context

The retirement dashboard currently displays results at the bottom of the form component, which is not optimal from a user experience perspective. The dashboard uses a two-column layout where users input their retirement information on the left and see charts and projections on the right. 

Currently, when users submit their form, the results are shown at the bottom of the form rather than in context with the charts that visualize those results.

## Goals / Non-Goals

**Goals:**
- Move the results display section from RetirementForm.tsx to RetirementCharts.tsx
- Position the results above the "Retirement Projection" chart in the right column
- Maintain all existing functionality and data flow without breaking changes
- Ensure proper formatting of financial values (3 decimal places)
- Keep the UI clean and consistent with existing styling

**Non-Goals:**
- Change any backend logic or API responses
- Modify the calculation algorithms or formulas
- Change the data models or database schema
- Add new features beyond positioning results above charts

## Decisions

1. **Component Structure**: The results section will be moved from RetirementForm.tsx to RetirementCharts.tsx as it's more contextually appropriate to show results alongside the visual projections.

2. **Data Flow**: Since the form already has access to the result data through its state management, we'll maintain this pattern by passing the result data from the parent page component down to both components.

3. **UI Positioning**: The results will be positioned directly above the main chart section in RetirementCharts.tsx, just before the "Retirement Projection" div.

4. **Styling Consistency**: We'll maintain the existing styling approach using Tailwind classes and follow the existing color schemes for success indicators.

## Risks / Trade-offs

- **Risk**: If result data isn't properly passed down to the new component location
  - **Mitigation**: Implement proper prop passing from parent page to charts component

- **Risk**: Styling inconsistencies if the component doesn't maintain same styles 
  - **Mitigation**: Use existing styling patterns and classes from the original implementation

- **Risk**: Breaking changes in data flow or state management
  - **Mitigation**: Keep all existing state management patterns but update component structure