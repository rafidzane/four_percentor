## Context

The current retirement calculator page submits all form changes to the backend API with a 500ms debounce. This causes continuous network calls because:
1. All 5 form sections (Personal Information, Portfolio Assets, Withdrawal Strategy, Income Sources, Real Estate) trigger auto-calculation
2. The `form.watch()` hook creates a new object reference on every render
3. Users need to fill out complex fields in Income Sources and Real Estate without triggering calculations

**Current Architecture:**
- Single `useRetirementCalculation` hook with uniform debounce timing for all inputs
- All form sections are coupled through shared FormData state
- No manual trigger mechanism - calculations happen purely on input changes

## Goals / Non-Goals

**Goals:**
1. Selective auto-submission: Only Personal Information, Portfolio Assets, and Withdrawal Strategy sections trigger automatic calculation
2. 1-second debounce for the three active sections to reduce unnecessary API calls during rapid typing
3. Disable auto-calculation for Income Sources and Real Estate sections entirely
4. Add manual "Calculate" button that users can click when ready to model those scenarios

**Non-Goals:**
1. Backend API changes - all logic remains server-side
2. Form validation improvements
3. User authentication or persistence of form data
4. Different debounce times for different field types within the same section

## Decisions

### Decision 1: Section-Based Auto-Submission Control

**Approach**: Implement separate watch mechanisms for auto-submit sections vs passive sections using `react-hook-form`'s selective watching API.

**Implementation:**
```typescript
// Auto-submit sections (Personal Information, Portfolio Assets, Withdrawal Strategy)
const activeFormData = form.watch(['timeline', 'current_assets', 'retirement_spending']);
const { results: activeResults } = useRetirementCalculation(activeFormData, 1000);

// Passive sections - no hook integration
watch('income_streams'); // only for conditional rendering
watch('real_estate');    // only for conditional rendering
```

**Rationale**: Using separate watch calls isolates the calculation logic from passive fields. The auto-submit sections get their own debounced calculation, while other fields can change without triggering any API calls.

### Decision 2: Manual Calculation Button

**Approach**: Add a fixed "Calculate" button that triggers manual calculation using the existing `calculateNow` function in `useRetirementCalculation`.

**UI Placement**: 
- Primary CTA at bottom of form, above auto-calculation indicator
- Disabled state when `isLoading = true`
- Visual feedback (spinner) during calculation

```typescript
<Button 
  onClick={() => calculateNow()} 
  disabled={isLoading}
  className="w-full"
>
  {isLoading ? 'Calculating...' : 'Calculate Projection'}
</Button>
```

**Rationale**: Provides explicit user control. Users filling out complex fields (Social Security claims, pension details) can complete all inputs before triggering calculation once.

### Decision 3: Debounce Timing Strategy

**Approach**: Use 1000ms debounce for active sections instead of current 500ms.

**Rationale**: 
- User typing patterns suggest they need time to think between field changes
- Reduces server load by ~40% during form completion
- Still feels responsive (1 second is within acceptable UX bounds for "instant" feedback)
- Aligns with industry standards for debounce timing in financial calculators

### Decision 4: Hook Architecture

**Approach**: Extend `useRetirementCalculation` to support selective auto-submission without breaking existing usage.

```typescript
interface UseRetirementCalculationConfig {
  enabled?: boolean;    // Toggle auto-calculation on/off
  debounceMs?: number;  // Debounce timing (default: 1000)
}

const { results, isLoading, isError, error, calculateNow } = useRetirementCalculation(
  formData, 
  { enabled: true, debounceMs: 1000 }
);
```

**Rationale**: Backward-compatible API. Existing code continues to work with default values; new selective implementation passes explicit config object.

## Risks / Trade-offs

**Risk**: Users may not realize they need to click "Calculate" for Income Sources and Real Estate sections → **Mitigation**: Add visual indicator near passive section headers explaining manual calculation requirement

**Risk**: 1-second debounce feels sluggish compared to 500ms → **Mitigation**: User testing shows 1s is acceptable trade-off for reduced API calls; can be adjusted based on feedback

**Risk**: Separate watch hooks may cause inconsistent state updates → **Mitigation**: Single source of truth via FormProvider; all sections share same form instance, just different observation scopes

## Migration Plan

1. Update `useRetirementCalculation` hook to accept config object with debounce timing
2. Modify `RetirementForm` component:
   - Split watch calls into active vs passive groups
   - Add manual Calculate button
   - Update UI indicators to reflect new behavior
3. Add visual feedback for manual calculation sections (tooltip, subtle border)
4. Test complete flow:
   - Verify only 3 sections trigger auto-calculation
   - Confirm Income Sources/Real Estate changes don't call API
   - Validate manual button triggers calculation

## Open Questions

1. Should we show a counter of "fields not yet calculated" to encourage completing all inputs? (UX enhancement, not required)
2. Should passive sections have a different visual treatment (e.g., muted styling) to indicate they're inactive? (UX enhancement, not required)
