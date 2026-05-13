## Context

The WithdrawalStrategySection component currently uses a custom `TypeToggleSlider` component for switching between "Amount" and "Pct" withdrawal types. This slider is not rendering correctly and users have reported it looks broken. Additionally, there may be issues with Period 2 visibility based on the checkbox toggle.

**Current state:**
- Custom TypeToggleSlider component exists at `/frontend/src/components/ui/type-toggle-slider.tsx`
- Uses Radix UI SliderPrimitive but has visual/layout issues
- Period 2 conditional rendering uses `{twoPeriodMode && (...)}` pattern
- Component imports and uses TypeToggleSlider for both periods

## Goals / Non-Goals

**Goals:**
- Replace broken custom slider with shadcn/ui Switch component (on/off toggle style)
- Ensure Period 2 section only appears when "Configure Period 2 spending" checkbox is checked
- Remove the non-functional TypeToggleSlider component file

**Non-Goals:**
- No backend changes required
- No new features or behavioral changes to withdrawal logic
- Keep existing tooltips and validation behavior

## Decisions

### Decision 1: Use Switch Component Instead of Slider
**Choice:** shadcn/ui `Switch` component instead of custom slider implementation

**Rationale:**
- Switch is standard on/off UI pattern, matches user expectation for binary choice (Amount vs Pct)
- Already available in project via shadcn/ui (`/frontend/src/components/ui/switch.tsx`)
- Better accessibility with proper ARIA attributes out of the box
- Cleaner implementation without custom slider positioning logic

**Alternative considered:** Segment control style toggle  
**Rejected:** Adds unnecessary visual complexity; Switch is more familiar pattern for binary choices

### Decision 2: Replace TypeToggleSlider with Inline Switch
**Choice:** Embed Switch component directly in WithdrawalStrategySection instead of keeping as separate reusable component

**Rationale:**
- The TypeToggleSlider had layout and rendering issues that indicate fundamental design problems
- Simple binary choice (Amount/Pct) is better served by a standard Switch with labels
- Reduces maintenance burden - no custom slider component to debug
- Follows shadcn/ui convention of using primitives directly

**Alternative considered:** Fix the TypeToggleSlider component  
**Rejected:** Component was created recently but has visual issues; starting fresh with established pattern is faster and more reliable

### Decision 3: Verify Period 2 Checkbox Behavior
**Choice:** Inspect and ensure `two_period_mode` checkbox properly controls Period 2 visibility

**Rationale:**
- Code shows `{twoPeriodMode && (...)}` conditional, but user reports Period 2 appears by default
- Could be initial form state issue or registration problem
- Need to verify the checkbox has proper default value in form schema

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Switch component styling may not match existing design | Use Tailwind classes consistent with other form elements; test visual appearance |
| Period 2 still appears by default after fix | Check RetirementForm initial values and ensure `two_period_mode` defaults to false |
| Users confused by new UI pattern | Switch is standard pattern in React UI libraries; minimal learning curve |

## Migration Plan

1. Delete `/frontend/src/components/ui/type-toggle-slider.tsx`
2. Update WithdrawalStrategySection:
   - Import `Switch` from shadcn/ui
   - Replace TypeToggleSlider usage with inline Switch components for Period 1 and Period 2
   - Add proper labels ("Amount" / "Pct") next to each switch
3. Verify checkbox behavior works correctly

## Open Questions

- What is the current default value of `two_period_mode` in RetirementForm schema? (needs verification)
