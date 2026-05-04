## Context

The retirement dashboard UI currently has a layout where the Returns Simulation section is displayed as a separate card from the Contributions section. This creates a fragmented user experience where related configuration parameters are visually separated, making it harder for users to understand how their contributions and returns simulation relate to each other.

Additionally, some form labels contain redundant "Yearly" terminology that can be simplified for cleaner, more intuitive interfaces while maintaining clarity.

## Goals / Non-Goals

**Goals:**
- Move the Returns Simulation section directly under Contributions within the Personal Information section
- Simplify form field labels by removing redundant "Yearly" terminology from contribution fields
- Reduce visual clutter and improve logical grouping of related configuration parameters
- Maintain all existing functionality and user experience without breaking changes

**Non-Goals:**
- Changing the underlying data model or API contracts
- Modifying the core retirement calculation logic
- Adding new features beyond the UI layout and labeling improvements
- Changing form validation rules or business logic

## Decisions

1. **UI Layout Restructuring**: The Returns Simulation section will be moved to appear immediately after the Contributions section within the same container, rather than as a separate card.

2. **Label Simplification**: Form labels will be simplified by removing "Yearly" from terms like:
   - "Yearly contribution" → "Contribution"
   - "Yearly contribution increase %" → "Contribution increase %"
   - "Catch-up contributions (age 50+)" → "Catchup"

3. **Visual Design**: The Returns Simulation section will maintain its current styling with border and padding to visually distinguish it from the Contributions fields while remaining part of the same logical grouping.

4. **Component Structure**: The change will be implemented within the existing `RetirementForm.tsx` component without introducing new components or breaking existing patterns.

## Risks / Trade-offs

- **User Adaptation Risk** → Mitigation: The changes are purely visual and maintain all existing functionality, so users will only need to relearn the layout flow rather than understand new concepts
- **Regression Risk** → Mitigation: All existing form validation, data binding, and conditional rendering logic remains unchanged
- **Testing Complexity** → Mitigation: Since this is a layout change with no functional changes, existing tests should continue to pass

## Migration Plan

1. Update the RetirementForm.tsx component to restructure the UI layout
2. Modify form labels to remove redundant "Yearly" terminology
3. Verify all existing functionality remains intact
4. Run existing test suite to ensure no regressions
5. Manual QA testing of the modified sections

## Open Questions

None - the scope is well-defined and implementation details are clear from the proposal and requirements.