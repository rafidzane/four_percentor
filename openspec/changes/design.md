## Context

**Current State:**
- Single 648-line component file with mixed concerns (UI, validation, API calls, results display)
- Collapsible sections via context provider add unnecessary complexity
- Validation logic embedded in component with scattered error handling
- No separation between calculation engine and UI rendering
- Two-person and single-person calculators have significant code duplication

**Constraints:**
- Must maintain same backend API compatibility
- Must preserve existing user workflow (redirect to two-person calculator)
- Need backward compatible data models for API responses

## Goals / Non-Goals

**Goals:**
- Break monolithic component into focused, testable modules
- Improve code readability and maintainability
- Reduce visual complexity for users
- Enable easier future enhancements
- Maintain all existing calculation capabilities

**Non-Goals:**
- Not adding new features (Monte Carlo, inflation adjustments)
- Not changing API contracts or backend behavior
- Not implementing chart visualization in this rewrite
- Not changing the user-facing functionality

## Decisions

1. **Component Architecture**: Split into separate files:
   - `RetirementForm.tsx` - Input collection and validation only
   - `ResultsDisplay.tsx` - Render results only (no calculations)
   - `calculateRetirement.ts` - Pure calculation functions (unit testable)
   - Main page file orchestrates components

2. **Validation**: Move to dedicated function returning structured errors, called on input change and before submission

3. **State Management**: Use local component state with clear setter patterns instead of context providers for this scope

4. **API Integration**: Create thin wrapper that handles request/response transformation only

5. **File Organization**:
   ```
   retirement/
   ├── page.tsx              # Redirect logic (unchanged)
   ├── two-person/
   │   └── page.tsx          # Orchestrates form + results
   ├── single-person/
   │   └── page.tsx          # Orchestrates form + results  
   └── _components/
       ├── RetirementForm.tsx
       ├── ResultsDisplay.tsx
       └── calculateRetirement.ts
   ```

6. **Remove Features** (will be removed from this rewrite, can be re-added later if needed):
   - Collapsible sections (all content visible)
   - Monte Carlo simulations
   - Inflation-adjusted savings display
   - Projected balance at specific age
   - Years to depletion calculation

## Risks / Trade-offs

**Risk**: Breaking existing user workflows during migration  
**Mitigation**: Keep same API endpoints, maintain field names where possible, test redirect flow

**Risk**: Loss of some "advanced" features may disappoint power users  
**Mitigation**: Document removals clearly; can be re-added in future based on user feedback

**Risk**: More files initially seems more complex  
**Mitigation**: Each file is focused and easier to understand individually; better long-term maintainability
