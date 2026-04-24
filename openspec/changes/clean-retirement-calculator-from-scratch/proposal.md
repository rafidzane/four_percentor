## Why

The current retirement calculator implementation is overly complex and difficult to maintain. It combines input validation, API calls, results display, and UI rendering in a single 648-line component file with excessive nesting and conditional logic. The code lacks separation of concerns, making it hard to test, debug, and extend.

## What Changes

- **Delete** all existing retirement calculator files (component, utils, contexts)
- **Create** a new clean-slate retirement calculator with:
  - Modular component architecture
  - Clear separation between input form, results display, and calculations
  - Simplified validation logic
  - Better organized state management
- **Remove** features that are rarely used or overly complex (e.g., Monte Carlo simulations, inflation adjustments)
- **Add** modern UI patterns with better accessibility

## Capabilities

### New Capabilities
- `retirement-calculator-v2`: New retirement calculator implementation with simplified feature set and modular architecture

### Modified Capabilities
<!-- None - this is a complete rewrite -->

## Impact

**Affected files:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementCalculator.tsx` (delete)
- `/frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx` (delete/rename)
- `/frontend/src/app/(main)/dashboard/retirement/single-person/_components/SinglePersonRetirementCalculator.tsx` (delete/rename)
- `/frontend/src/components/retirement-calculator/*` (all components in this directory - delete)
- `/frontend/src/app/(main)/dashboard/retirement/page.tsx` (update redirect path)

**Dependencies:**
- Backend API endpoints remain unchanged (`/fourpercent/api/v2/deep_retirement`, `/fourpercent/api/v3/retirement`)
- Existing API client code (`lib/api.ts`) remains unchanged
