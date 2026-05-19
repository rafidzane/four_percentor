## Why

The retirement calculator form has several UI and functionality issues that impact user experience and code maintainability. Analysis revealed problems in the Withdrawal Strategy section (Period 2 visibility), Portfolio Assets section (missing Returns Simulation implementation), duplicate calculation indicators, inconsistent styling, and conditional rendering logic issues.

## What Changes

- **Fix Period 2 Visibility**: Add proper conditional rendering for Period 2 configuration based on `two_period_mode` toggle
- **Implement Returns Simulation Section**: Add the Returns Simulation content under Contributions in Portfolio Assets section (matches memory about reorganization)
- **Remove Duplicate Calculation Indicator**: Eliminate redundant "Manual calculation" message from form component
- **Standardize Real Estate Card Styling**: Update RealEstateSection to use consistent rounded-2xl border pattern
- **Simplify Spouse Field Conditional Logic**: Fix overly complex conditional rendering in PersonalInformationSection

## Capabilities

### New Capabilities
- None (this is a bug fix/implementation completion)

### Modified Capabilities
- `withdrawal-strategy-section`: Period 2 configuration should only appear when two_period_mode is enabled (currently toggle exists but section always visible)
- `portfolio-assets-section`: Returns Simulation section placeholder needs implementation under Contributions
- `real-estate-section`: Card styling inconsistent with project design system

## Impact

**Frontend Files Affected:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/WithdrawalStrategySection.tsx` - Fix Period 2 conditional rendering
- `/frontend/src/app/(main)/dashboard/retirement/_components/PortfolioAssetsSection.tsx` - Add Returns Simulation section under Contributions
- `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx` - Remove duplicate calculation indicator
- `/frontend/src/app/(main)/dashboard/retirement/_components/RealEstateSection.tsx` - Fix card styling to match project pattern
- `/frontend/src/app/(main)/dashboard/retirement/_components/PersonalInformationSection.tsx` - Simplify spouse field conditional logic

**No backend changes required** - all fixes are UI-level improvements.
