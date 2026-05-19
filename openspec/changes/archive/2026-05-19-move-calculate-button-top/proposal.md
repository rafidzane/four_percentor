## Why

The Calculate button is currently positioned at the bottom of the retirement form, requiring users to scroll through all input sections before triggering a calculation. This creates a poor user experience because:

1. **Long scroll distance**: Users must navigate past 5+ form sections to reach the button
2. **Delayed feedback**: Results only appear after scrolling back up to see them
3. **Non-intuitive flow**: The natural workflow should be: configure inputs → calculate → view results

## What Changes

- Move Calculate button from bottom of `RetirementForm.tsx` to top right column in `page.tsx`
- Position button above the retirement results summary cards
- Button remains functionally identical (triggers same calculation)
- Remove duplicate loading indicators and error states from form body
- Consolidate UI controls at the top of the form

## Capabilities

### Modified Capabilities
- `retirement-form-ui`: This capability covers the UI layout and placement of form elements. The calculate button location is modified from bottom of form to top-right column above results summary.

## Impact

**Affected Files:**
- `frontend/src/app/(main)/dashboard/retirement/page.tsx` - Add Calculate button to right column header
- `frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx` - Remove bottom button and related loading/error UI

**User Impact:**
- Improved workflow efficiency (no scrolling required)
- Immediate visibility of results after calculation
- Better visual hierarchy with primary action at top

**No breaking changes** - functionality remains identical, only placement changes.
