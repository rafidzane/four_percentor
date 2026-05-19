## 1. Withdrawal Strategy Section Fixes

- [x] 1.1 Add conditional rendering for Period 2 configuration section in WithdrawalStrategySection.tsx (wrap Period 2 div with `twoPeriodMode` check)
- [x] 1.2 Verify Period 2 fields are hidden by default and show only when toggle is enabled
- [x] 1.3 Test that Period 2 fields hide correctly when toggle is disabled

**Verification:** Period 2 section uses conditional rendering `{twoPeriodMode && (<div>...)}` (lines 345-349). When `twoPeriodMode` is false, the entire Period 2 configuration block is not rendered.

## 2. Portfolio Assets Section Fixes

- [x] 2.1 Locate Returns Simulation component or create inline implementation under Contributions in PortfolioAssetsSection.tsx
- [x] 2.2 Position Returns Simulation section immediately after Contributions within the same card container
- [x] 2.3 Verify all Returns Simulation fields are present: equity return pre-retirement %, equity return post-retirement %, fixed income return %, inflation rate %

## 3. Form Structure Fixes

- [x] 3.1 Remove duplicate "Manual calculation enabled..." indicator from RetirementForm.tsx component
- [x] 3.2 Ensure calculation indicator only appears in main page component (retirement/page.tsx)

## 4. Real Estate Section Styling Fixes


- [x] 4.1 Replace `border-l-4` and `min-h-[200px]` with project-standard card classes (`rounded-2xl border bg-card text-card-foreground shadow-sm`)
- [x] 4.2 Add decorative accent bar matching the blue color theme (using `bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500`)
- [x] 4.3 Verify Real Estate section matches visual style of other form sections

## 5. Personal Information Section Logic Fixes

- [x] 5.1 Simplify spouse field conditional rendering in PersonalInformationSection.tsx
- [x] 5.2 Replace complex `(showSpouseFields || showSpouseFields === false)` with simpler logic (e.g., `if (spouseAge > 0)`)
- [x] 5.3 Test that spouse fields show/hide correctly when spouse age is modified

## 6. Verification

- [x] 6.1 Run frontend build to verify no TypeScript errors
- [x] 6.2 Test retirement form displays correctly in browser with all fixes applied
- [x] 6.3 Verify Period 2 toggle shows/hides section properly
- [x] 6.4 Verify all validation rules continue to work after UI changes
