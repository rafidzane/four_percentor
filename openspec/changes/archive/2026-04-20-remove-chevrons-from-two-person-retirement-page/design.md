## Context

Current two-person retirement calculator uses CollapsibleSection components for husband and spouse projections. The chevron icons (arrows) are displayed next to section titles but provide no functional value.

## Goals / Non-Goals

**Goals:**
- Remove visual chevron icons from individual projection sections
- Maintain clean, minimal UI for projection display
- No functional changes to collapsible behavior

**Non-Goals:**
- Not changing the CollapsibleSection component itself (reusable elsewhere)
- Not modifying any data or calculations

## Decisions

1. **Implementation approach**: Use CSS to hide chevron elements in individual projection sections
   - Target specific section IDs (`husband-details`, `spouse-details`)
   - Apply `display: none` to chevron elements via CSS class or inline style
   - Keep CollapsibleSection component unchanged for other uses

2. **Alternative considered**: Modify CollapsibleSection prop interface (rejected)
   - Would require passing new props through the component
   - Overly complex for a simple visual change
   - Would affect all usages of the component

## Risks / Trade-offs

[No significant risks. This is purely cosmetic and doesn't affect functionality.]
