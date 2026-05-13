## Why

Users currently see retirement calculation results (Final Balance, Average Balance, Max/Min Balance) without context about what these metrics mean or how they should interpret them. This creates uncertainty and reduces the tool's effectiveness in helping users understand their retirement outlook. Tooltips provide immediate educational value while keeping the UI clean, and visual icons make financial data more accessible and scannable.

## What Changes

- Add SVG icon indicators to each balance metric (Final, Average, Max, Min)
- Implement tooltip on hover explaining what each metric means:
  - **Final Balance**: Portfolio value at end of projection period
  - **Average Balance**: Mean portfolio value across all years (indicates typical wealth level)
  - **Max Balance**: Peak portfolio value achieved during projection (best-case scenario)
  - **Min Balance**: Lowest portfolio value reached (worst-case stress point, indicates risk exposure)
- Add summary card section at top of retirement page with these metrics displayed prominently with icons

## Capabilities

### New Capabilities
- `retirement-metric-tooltips`: Tooltip component for explaining financial metrics
- `balance-icons`: SVG icon set for balance-related visual indicators
- `summary-cards`: Reusable card components for displaying key financial summaries

### Modified Capabilities
None (this is a UI enhancement that doesn't change API requirements)

## Impact

**Affected code:**
- `/frontend/src/components/retirement-dashboard/ui/RetirementResultsSummary.tsx` - Add tooltips and icons to metrics display
- `/frontend/src/app/(main)/dashboard/retirement/page.tsx` - Create summary card section at top of page
- New reusable tooltip component or use existing shadcn Tooltip

**API changes:** None (purely frontend enhancement)

**Dependencies:** 
- Existing shadcn `Tooltip`, `TooltipContent`, `TooltipTrigger`, `TooltipProvider` components
- Recharts for chart integration (if adding to charts later)
