## Context

**Current State:**
- Calculate button is at the bottom of `RetirementForm.tsx` (after all 5 form sections)
- Users must scroll through entire form to trigger calculation
- Results display in right column after button click
- Loading/error states appear inline in form body

**Target State:**
- Calculate button positioned at top right, above results summary
- Immediate visual feedback when result appears
- Cleaner separation between input form and results display
- Better visual hierarchy with primary action prominent

## Goals / Non-Goals

### Goals
1. Move Calculate button to top-right above results summary in the grid layout
2. Keep functionality identical (same calculation trigger, same loading/error states)
3. Maintain responsive behavior across mobile/tablet/desktop
4. Improve user workflow by reducing scroll distance

### Non-Goals
1. Change calculation logic or API calls
2. Modify form section structure or content
3. Add new features or capabilities
4. Change button styling beyond positioning

## Decisions

### 1. Button Location: Right Column Header (Top)
**Why:** The right column shows results, making it the natural place for the action that triggers those results. Users think "configure inputs → calculate → view results."

**Alternative Considered:** Keep in form but move above first section
- **Rejected:** Because results are in right column, having button there creates better mental model

### 2. No Loading/Errors in Form Body
**Why:** When button is at top, loading/error indicators should be near the action, not buried at bottom of form.

**Implementation:**
- Remove loading indicator and error banner from `RetirementForm.tsx`
- Keep result display in right column (already there)
- Button disabled state during calculation provides visual feedback

### 3. Maintain Split-Pane Layout
**Why:** Current layout is intentional - inputs on left for configuration, results on right for consumption.

**No Changes:**
- Grid structure (`grid-cols-1 lg:grid-cols-2`) remains unchanged
- Section ordering in form unchanged
- Responsive behavior preserved

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users might miss button if they're already scrolled down | Button is visually distinct (full-width, purple) and at top of right column header |
| Mobile users have less screen real estate | Button remains accessible at top; no visual regression on small screens |
| Change in expectations for where action buttons belong | Consistent with common web patterns (action near results area) |

## Migration Plan

1. **Step 1:** Add Calculate button to `page.tsx` right column header
2. **Step 2:** Remove Calculate button from `RetirementForm.tsx`
3. **Step 3:** Remove loading indicator and error banner from form body
4. **Step 4:** Verify calculation still works with new placement
5. **Step 5:** Test responsive behavior on mobile/tablet

**Rollback Strategy:** If issues detected, revert these two files to previous state.

## Open Questions

None - this is a straightforward UI repositioning with clear requirements.
