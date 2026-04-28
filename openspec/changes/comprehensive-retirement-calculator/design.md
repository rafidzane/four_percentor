## Context

The current `/dashboard/retirement` page is a placeholder with only stat cards. The backend already has comprehensive retirement calculation models and logic implemented:

**Backend (existing):**
- `RetirementInput` model with nested sections: Timeline, CurrentAssets, PortfolioAllocation, SpendingStrategy, IncomeStreams, RealEstate, Education
- `RetirementCalculator` class with projection logic including:
  - Pre/post-retirement portfolio growth
  - Contribution scaling
  - Inflation adjustment
  - Multiple income stream integration (SS, pensions, rentals)
  - Success probability calculation

**Current Frontend:**
- Tab navigation exists but only "Overview" tab is functional
- Placeholder overview with basic stat cards
- No input form or projection display

## Goals / Non-Goals

**Goals:**
1. Create a comprehensive multi-section input form for retirement planning
2. Implement the Projection tab to display calculated results
3. Organize inputs by logical categories (Personal, Portfolio, Contributions, Returns, Withdrawal Strategy, Income Sources, Expenses, Real Estate)
4. Use existing shadcn/ui component library
5. Mock backend API that accepts inputs and returns computed projections

**Non-Goals:**
1. Monte Carlo simulation or probabilistic analysis (beyond basic success metric)
2. Real-time chart updates during form interaction
3. Data persistence beyond current session
4. Export functionality (CSV/PDF)

## Decisions

### 1. Component Structure
- **Form sections as separate components** - Each category (Personal, Portfolio, etc.) gets its own component file in `frontend/src/components/retirement-dashboard/ui/`
- **State management** - Use React's `useState` with a context or parent component to share state across form sections
- **Validation** - Client-side validation on each section before proceeding

### 2. UI Pattern
- **Stepper/Wizard approach** or **Collapsible accordion** for long form
- Given the extensive fields, accordion pattern is more user-friendly for viewing all inputs at once
- Each category in a `Card` component with grouped fields using existing `InputGroup`

### 3. Backend Integration
- Use existing `/fourpercent/api/v4/retirement` endpoint
- Create mock data fallback if API call fails
- Loading states during computation

### 4. Chart Library
- Existing `AssetsLineChart.tsx` can be adapted for portfolio balance timeline
- Reuse existing chart components in `frontend/src/components/retirement-dashboard/charts/`

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Form becomes overwhelming with 50+ fields | Group into collapsible sections, provide sensible defaults |
| Client-side validation may miss backend constraints | Keep backend as source of truth; validate inputs against Pydantic model specs |
| Performance issues with many form fields | Implement lazy rendering for non-visible sections |

## Migration Plan

**Phase 1: Form Components**
1. Create `PersonalSection` component (age, retirement age, spouse)
2. Create `PortfolioSection` component (assets, allocations)
3. Create `ContributionsSection` component
4. Create `ReturnsSection` component (mode selector, returns, inflation)
5. Create `WithdrawalSection` component (strategy selectors)
6. Create `IncomeSourcesSection` component (SS, pensions, rentals)
7. Create `ExpensesSection` component
8. Create `RealEstateSection` component

**Phase 2: Integration**
1. Update retirement page to include full form
2. Wire up API call to backend
3. Display results in new Projection tab

**Phase 3: Polish**
1. Add form validation
2. Implement loading states
3. Add helpful error messages
