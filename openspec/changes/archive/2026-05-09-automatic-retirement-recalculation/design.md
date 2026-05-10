## Context

The retirement calculator currently uses a traditional form pattern where users fill in values and click "Calculate" to see results. The calculation logic lives in both frontend (for real-time preview) and backend (for persistent storage and complex simulations). Currently, the form has explicit submit buttons that trigger recalculation.

**Current State:**
- Form inputs use `onChange` handlers but don't trigger calculations immediately
- Calculation is triggered by clicking "Calculate" button in each section or main submit
- Results display updates only after manual submission
- No visual feedback during calculation processing

## Goals / Non-Goals

**Goals:**
- Automatically recalculate results when any form value changes
- Implement debouncing to prevent excessive calculations during rapid typing
- Provide loading states to indicate active calculations
- Maintain or improve performance with reactive updates
- Keep existing calculation logic intact (no algorithmic changes)

**Non-Goals:**
- Changing the core Monte Carlo simulation algorithms
- Modifying backend API structure
- Adding new features beyond automatic recalculation
- Real-time collaboration or multi-user editing support

## Decisions

### 1. Debounce Implementation Strategy

**Decision**: Use `useDebounce` custom hook with 500ms delay for all input changes

**Rationale:**
- 300-500ms provides good balance between responsiveness and performance
- Prevents calculation spam during rapid typing (e.g., entering "100000" character by character)
- Short enough to feel responsive, long enough to allow users to complete thoughts

**Alternatives Considered:**
- `useDebounceCallback` from `react-use`: More complex API, overkill for this use case
- Native `setTimeout` in component: Less reusable, harder to clean up
- React Query's `staleTime`: Not appropriate for form input changes

### 2. Component Architecture

**Decision**: Create dedicated calculation hook (`useRetirementCalculation`) that manages debounced recalculation

**Structure:**
```typescript
// New custom hook in /frontend/src/hooks/useRetirementCalculation.ts
const { results, isLoading, isError, error } = useRetirementCalculation(formValues);

// Usage in RetirementForm
const calculationState = useRetirementCalculation(formState.watch());
```

**Benefits:**
- Separates calculation logic from UI concerns
- Easy to test and mock
- Reusable across different form contexts
- Centralized error handling

### 3. Loading State Management

**Decision**: Use shadcn/ui's `Skeleton` component for loading states with conditional rendering

**Implementation:**
```typescript
{isLoading ? (
  <RetirementResultsSummary.Skeleton />
) : (
  <RetirementResultsSummary results={results} />
)}
```

**Rationale:**
- Consistent with existing design system
- Provides clear visual feedback without layout shift
- Skeleton components match final content structure

### 4. Error Handling Strategy

**Decision**: Display inline errors in affected input fields and summary error banner at top of results section

**Implementation:**
```typescript
{isError && (
  <Alert variant="destructive" className="mb-4">
    <AlertTitle>Calculation Error</AlertTitle>
    <AlertDescription>{error?.message}</AlertDescription>
  </Alert>
)}
```

### 5. React Query Integration (Optional Enhancement)

**Decision**: Use React Query for server-side calculation caching, but keep immediate client-side validation separate

**Rationale:**
- Avoids unnecessary API calls during form editing
- Caches expensive Monte Carlo calculations after debounce completes
- Can be added incrementally without blocking initial implementation

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Excessive recalculations degrading performance | Medium | Debounce with 500ms delay; memoize calculation results using `useMemo` |
| Users missing that changes triggered recalculation | Low | Add subtle visual indicator (spinner or loading text) in results area |
| Race conditions from rapid input changes | Low | Cancel previous calculations using `AbortController` or cleanup function |
| Increased bundle size with new hooks/components | Low | Code-split calculation logic if needed; tree-shaking should handle unused code |

## Migration Plan

1. **Phase 1**: Create custom hook and integrate with RetirementForm
2. **Phase 2**: Add loading states and error handling UI
3. **Phase 3**: User testing to validate responsiveness and performance
4. **Rollback**: Revert to button-based submission by removing debounced hooks (single file change)

## Open Questions

1. Should different input types have different debounce delays? (e.g., number inputs vs dropdowns)
2. Should we provide a "Calculate Now" override for users who want immediate feedback without waiting?
3. What's the maximum calculation time before we show a warning to the user?
