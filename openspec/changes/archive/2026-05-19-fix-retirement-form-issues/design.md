## Context

The retirement calculator form has multiple UI issues identified through code review:

1. **Period 2 Visibility**: The `two_period_mode` toggle exists in `WithdrawalStrategySection.tsx` but Period 2 configuration section doesn't properly hide/show based on this setting.

2. **Returns Simulation Section**: `PortfolioAssetsSection.tsx` contains a placeholder comment at line 185 about Returns Simulation but no actual implementation, despite memory indicating it should be moved under Contributions.

3. **Duplicate Calculation Indicator**: The "Manual calculation enabled..." message appears in both `RetirementForm.tsx` and the main page component.

4. **Inconsistent Card Styling**: `RealEstateSection.tsx` uses `border-l-4` instead of the project's standard rounded-2xl border pattern.

5. **Complex Conditional Logic**: `PersonalInformationSection.tsx` has overly complex conditionals like `(showSpouseFields || showSpouseFields === false)`.

## Goals / Non-Goals

**Goals:**
- Fix Period 2 visibility to only show when `two_period_mode` is true
- Implement Returns Simulation section under Contributions in Portfolio Assets
- Remove duplicate calculation indicator message
- Standardize Real Estate card styling to match project pattern
- Simplify spouse field conditional rendering logic

**Non-Goals:**
- No new features or functionality additions
- No backend changes required
- No API contract modifications
- No visual redesign of components

## Decisions

| Decision | Rationale |
|----------|-----------|
| Keep existing data structure | All fixes are UI-level only; form data model is correct |
| Use conditional rendering with `twoPeriodMode` check | Simple boolean-based visibility toggle is sufficient for Period 2 section |
| Implement Returns Simulation as inline content under Contributions | Matches memory about reorganization; no new component needed |
| Move calculation indicator to page level only | Form should not have its own calculation status message; belongs in parent page component |
| Use consistent card classes across all sections | Project uses `rounded-2xl border bg-card shadow-sm` pattern; RealEstateSection deviates |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking existing user workflows with UI changes | All changes are cosmetic/UI improvements; no data flow or validation logic changed |
| Returns Simulation implementation missing requirements | Will implement as placeholder content matching memory spec (moved under Contributions) |

## Migration Plan

1. Update `WithdrawalStrategySection.tsx` to wrap Period 2 configuration in `{twoPeriodMode && (...)}` conditional
2. Add Returns Simulation UI components under Contributions in `PortfolioAssetsSection.tsx`
3. Remove duplicate calculation indicator from `RetirementForm.tsx`
4. Replace RealEstateSection card styling with project-standard pattern
5. Simplify spouse field conditionals in `PersonalInformationSection.tsx`

**Rollback strategy:** All changes are isolated to UI components; can be reverted by reverting affected files.
