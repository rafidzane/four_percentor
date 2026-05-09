# Refactor RetirementForm Component

## What
Refactor the large RetirementForm component into smaller, more manageable components by section while maintaining all existing functionality and UI.

## Why
The current RetirementForm.tsx file is a monolithic component that's difficult to maintain, debug, and extend. Breaking it down into smaller components will:
- Improve code organization and readability
- Make it easier to test individual sections
- Enable better reusability of components
- Allow for more targeted bug fixes
- Improve developer experience when working on specific sections

## Current State
The RetirementForm component is a single file (~1500 lines) that contains all sections:
1. Personal Information 
2. Portfolio Assets (including Contributions)
3. Returns Section (integrated with Portfolio Assets)
4. Withdrawal Strategy
5. Income Sources
6. Real Estate

## Scope
This refactor will break down the component by logical sections while preserving:
- All existing UI layouts and styling
- All form functionality and validation
- All data models and field names
- All tooltips and accessibility features
- All existing behavior patterns

## Expected Outcome
After refactoring, the component structure will be:
- `PersonalInformationSection.tsx`
- `PortfolioAssetsSection.tsx` 
- `WithdrawalStrategySection.tsx`
- `IncomeSourcesSection.tsx`
- `RealEstateSection.tsx`
- Main `RetirementForm.tsx` that imports and orchestrates these components