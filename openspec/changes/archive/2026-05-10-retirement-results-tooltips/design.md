## Context

**Current State:**
- `RetirementResultsSummary` component displays Final/Average/Max/Min Balance as simple text labels with values
- No contextual information about what these metrics mean or how users should interpret them
- Users may not understand the significance of each metric (e.g., Min Balance indicates worst-case scenario)

**User Needs:**
- Immediate clarification when viewing results without leaving the page
- Visual cues to help scan and compare metrics quickly
- Educational tooltips that explain "why this matters" for each metric

## Goals / Non-Goals

**Goals:**
1. Add hover tooltips explaining each balance metric's meaning and relevance
2. Create visual distinction between different metric types using SVG icons
3. Implement summary card section at top of retirement page displaying all key metrics prominently
4. Maintain consistent styling with existing shadcn/ui design system
5. Ensure tooltips are accessible (keyboard navigation, screen reader support)

**Non-Goals:**
1. No backend API changes required
2. No redesign of chart components (focus on results summary only)
3. No real-time tooltip updates during calculation loading state
4. No custom icon library - use inline SVGs or Lucide icons from shadcn

## Decisions

### 1. Tooltip Implementation Strategy
**Decision:** Use existing `shadcn/ui Tooltip` component (Tooltip + TooltipContent + TooltipTrigger)

**Rationale:**
- Already available in project via shadcn/ui installation
- Provides accessible, keyboard-navigable tooltips out of the box
- Consistent with project's design system
- No additional dependencies needed

### 2. Icon Strategy
**Decision:** Use inline SVG icons for each metric type:
- **Final Balance**: 💰 (pocket money bag or wallet icon) - represents end state
- **Average Balance**: 📊 (bar chart or trend icon) - represents typical level  
- **Max Balance**: ⬆️ (arrow up or trophy icon) - represents best outcome
- **Min Balance**: ⚠️ (shield alert or warning icon) - represents risk/stress point

**Rationale:**
- Inline SVGs avoid external icon dependency
- Visual metaphors align with financial concepts
- Can be styled consistently using Tailwind classes
- Small file size, no network requests

### 3. Summary Card Component
**Decision:** Create new `RetirementSummaryCards` component that displays all four metrics in a responsive grid

**Component Structure:**
```tsx
<RetirementSummaryCards result={result}>
  <MetricCard icon={<WalletIcon />} label="Final Balance" value="$1,140,246">
    Tooltip: Portfolio value at end of projection period. This is your remaining wealth after the full retirement timeline.
  </MetricCard>
  <MetricCard icon={<TrendIcon />} label="Average Balance" value="$817,289">
    Tooltip: Mean portfolio value across all years. Indicates typical wealth level throughout retirement.
  </MetricCard>
  <MetricCard icon={<ArrowUpIcon />} label="Max Balance" value="$1,140,246">
    Tooltip: Peak portfolio value achieved during projection. Represents best-case scenario if market performs optimally.
  </MetricCard>
  <MetricCard icon={<AlertCircleIcon />} label="Min Balance" value="$275,470">
    Tooltip: Lowest portfolio value reached during projection. Indicates worst-case stress point and your risk exposure.
  </MetricCard>
</RetirementSummaryCards>
```

**Placement:** Above existing `RetirementResultsSummary` component on retirement page

### 4. Accessibility Approach
- Tooltips use semantic `<span>` with `aria-describedby` for screen readers
- Icons have `aria-hidden="true"` (decorative)
- Tooltip content is readable via keyboard focus (tab to trigger, esc to dismiss)

## Risks / Trade-offs

**Risk:** Tooltip text may be too long or technical → **Mitigation:** Keep descriptions concise (1-2 sentences), use plain language

**Risk:** Visual clutter from icons and tooltips → **Mitigation:** Use subtle icon colors, ensure sufficient whitespace between cards

**Risk:** Mobile usability concerns with hover-based tooltips → **Mitigation:** Tooltips trigger on tap/click for touch devices, fallback to permanent labels if needed

## Migration Plan

1. Create `RetirementSummaryCards` component in `/frontend/src/components/retirement-dashboard/ui/`
2. Add inline SVG icon components (create as small functional components)
3. Update retirement page to include summary cards above results summary
4. Enhance existing `RetirementResultsSummary` with tooltips on metrics
5. Test accessibility with keyboard navigation and screen reader

## Open Questions

1. Should Min Balance use warning color (red/orange) to indicate risk? → **Recommendation:** Yes, use subtle orange/red accent for Min Balance icon to visually signal caution
2. Should we add success rate metric tooltips as well? → **Out of scope for this change** - can be added in follow-up iteration
