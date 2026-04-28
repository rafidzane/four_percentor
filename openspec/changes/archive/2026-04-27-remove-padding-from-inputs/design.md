## Context

The retirement dashboard currently has input fields and labels with excessive padding that makes the interface appear bloated. The goal is to create a tighter, more compact layout that maximizes usable space while maintaining usability and clarity.

## Goals / Non-Goals

**Goals:**
- Reduce padding in input fields to make them more compact
- Decrease spacing around labels to create a denser form layout
- Maintain accessibility standards and usability
- Preserve all existing functionality and user experience
- Improve visual density without sacrificing clarity

**Non-Goals:**
- Change the underlying data models or API behavior
- Modify the core calculation logic or visualization components
- Change the overall dashboard structure or layout
- Affect any other UI elements beyond input fields and labels

## Decisions

1. **CSS class modifications**: Reduce padding classes from `px-3 py-2` to `px-2 py-1` for input fields
2. **Label styling**: Reduce spacing from `mb-1` to `mb-0.5` for tighter label placement
3. **Space-y reduction**: Change from `space-y-2` to `space-y-1` for vertical spacing between form elements
4. **Font size reduction**: Change from `text-sm` to `text-xs` for labels and inputs
5. **Grid gap reduction**: Change from `gap-6` to `gap-4` for reduced spacing between form sections

## Risks / Trade-offs

- **Reduced touch target size** → Mitigation: Maintain minimum accessible sizes and ensure sufficient spacing between interactive elements
- **Visual clutter** → Mitigation: The reduction in padding creates a cleaner, more focused interface while maintaining usability