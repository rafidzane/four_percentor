## Why

The retirement calculator page is making continuous network requests to the backend API on every render and input change across all form sections. This creates excessive load, poor user experience, and unnecessary API consumption. Users want immediate feedback only when they modify key inputs (personal information and portfolio assets), not for every field in income sources or real estate sections.

## What Changes

- **Selective Auto-Submission**: Only three sections trigger automatic calculation: Personal Information, Portfolio Assets, and Withdrawal Strategy
- **Increased Debounce Time**: Changed from 500ms to 1 second debounce for these three sections to reduce unnecessary calculations during rapid typing
- **Disabled Auto-Submission**: Income Sources and Real Estate sections will no longer trigger auto-calculation. Users must manually trigger calculation when ready to model those scenarios
- **Manual Trigger Button**: Add a "Calculate" button that users can click to submit the current form state for manual recalculation

## Capabilities

### New Capabilities
- `selective-form-auto-submit`: Configure which form sections trigger automatic calculation with configurable debounce times per section type
- `manual-calculation-trigger`: Provide explicit user control over when calculations are submitted to backend
- `section-based-debounce-config`: Different debounce timing for different categories of form inputs

### Modified Capabilities
None - this is a new capability layer added on top of existing retirement calculation functionality

## Impact

**Frontend Changes:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx` - Add manual trigger button, configure selective auto-submit per section
- `/frontend/src/hooks/useRetirementCalculation.ts` - Support configurable debounce times and manual triggering
- `/frontend/src/components/ui/button.tsx` - May need to add "Calculate" button variant if not available

**Backend Changes:**
None - API endpoints remain unchanged

**User Experience:**
- Reduced API calls during form filling
- Clearer user control over when calculations occur
- Better performance with reduced server load
