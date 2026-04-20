## Context

The Two-Person Retirement Calculator currently displays 6 household metrics as individual stacked cards in a vertical layout within the "Household Results" collapsible section. The results are rendered using Tailwind CSS card components with border-left accent colors.

**Current state (simplified):**
```tsx
<div className="space-y-4">
  <div className="rounded-lg border-green-500 ...">Metric 1</div>
  <div className="rounded-lg border-blue-500 ...">Metric 2</div>
  <div className="rounded-lg border-purple-500 ...">Metric 3</div>
  <div className="rounded-lg border-teal-500 ...">Metric 4</div>
  <div className="rounded-lg border-orange-500 ...">Metric 5</div>
  <div className="rounded-lg border-yellow-500 ...">Metric 6</div>
</div>
```

## Goals / Non-Goals

**Goals:**
- Reduce vertical space usage by organizing metrics into a compact 3x2 grid
- Improve visual hierarchy and quick comparison between metrics
- Maintain all existing data fields and styling
- Keep responsive behavior (stack on mobile)

**Non-Goals:**
- No changes to metric calculations or data sources
- No changes to collapsible section behavior
- No changes to error handling or loading states

## Decisions

1. **CSS Grid Layout**: Use `grid grid-cols-3` with `gap-4` for the 3x2 layout
   - 3 columns × 2 rows = 6 cards total
   - Automatic wrapping ensures responsive behavior on smaller screens
   
2. **Preserve Existing Card Styling**: Keep all current Tailwind classes (border colors, backgrounds, padding)
   - Only change the container from `space-y-4` to grid layout
   - Maintain individual card visual identity through color-coded borders

3. **Responsive Behavior**: Add media query for mobile stacking
   - At screen width < 768px: switch to `grid-cols-1` (single column)
   - At larger widths: use `grid-cols-3`

4. **No Data Changes**: The grid is purely a visual reorganization
   - All data fields remain the same
   - No API or state changes required

## Risks / Trade-offs

- **Risk**: Grid may appear cramped on very small screens
  - **Mitigation**: Mobile responsive override stacks cards vertically
  
- **Risk**: Some users may prefer vertical layout for readability
  - **Mitigation**: Keep collapsible section behavior unchanged; users can collapse if desired

## Migration Plan

1. Update `TwoPersonRetirementCalculator.tsx` to use grid layout instead of `space-y-4`
2. Add responsive media query for mobile stacking
3. Test on various screen sizes (mobile, tablet, desktop)
4. Verify all 6 cards render correctly with their data
