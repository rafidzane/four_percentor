## Context

Current two-person retirement calculator displays individual projections vertically:
1. Husband's Projection (top)
2. Spouse's Projection (below husband)

Users want side-by-side comparison for easier visual analysis.

## Goals / Non-Goals

**Goals:**
- Display husband and spouse projections horizontally
- Maintain collapsible section behavior for each projection
- Keep consistent styling and formatting with existing code
- Responsive design that adapts to smaller screens

**Non-Goals:**
- Not changing the data structure or calculations
- Not modifying input sections (still on left side)
- Not removing any information from projections

## Decisions

1. **Layout approach**: Use CSS grid with 2 columns for individual projections section
   - Husband's projection in left column
   - Spouse's projection in right column
   - Each projection maintains its collapsible section behavior
   
2. **Responsive handling**: On mobile (<768px), revert to vertical stacking
   - Keep husband above spouse when screen is narrow
   - Use existing media query pattern from inputs grid

3. **Implementation location**: Modify `TwoPersonRetirementCalculator.tsx` lines 491-510
   - Replace single-column vertical layout with 2-column grid
   - Maintain current collapsible section structure for each person

## Risks / Trade-offs

[No significant risks identified. This is a UI-only change with no data model or calculation impact.]
