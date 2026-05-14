## 1. Fix Period 1 Withdrawal Type Toggle

- [x] 1.1 Identify the Switch component in Period 1 section (around line 107)
- [x] 1.2 Update the onCheckedChange handler to properly update form state
- [x] 1.3 Add console.log or debugging to verify setValue is being called
- [x] 1.4 Test toggle from Amount to Percentage
- [x] 1.5 Test toggle from Percentage to Amount

## 2. Fix Period 2 Withdrawal Type Toggle

- [x] 2.1 Identify the Switch component in Period 2 section (around line 189)
- [x] 2.2 Update the onCheckedChange handler to properly update form state
- [x] 2.3 Test toggle from Amount to Percentage when Period 2 is enabled
- [x] 2.4 Test toggle from Percentage to Amount when Period 2 is enabled

## 3. Verification

- [x] 3.1 Verify both Period 1 and Period 2 switches work correctly
- [x] 3.2 Verify input fields change based on toggle selection (amount vs percentage)
- [x] 3.3 Run the development server and test in browser
- [x] 3.4 Submit form to ensure values are properly serialized

## 4. UI/UX Polish

- [x] 4.1 Redesign component with refined editorial aesthetic
- [x] 4.2 Add gradient accents and visual hierarchy
- [x] 4.3 Implement custom toggle buttons instead of native switches
- [x] 4.4 Add smooth animations and transitions
- [x] 4.5 Improve form field presentation with proper labels and icons

## 5. Compact Layout Redesign

- [ ] 5.1 Move all Period inputs to single line layout
- [ ] 5.2 Reduce input padding significantly (py-2 → py-1)
- [ ] 5.3 Use smaller inputs (h-7 instead of h-9)
- [ ] 5.4 Simplified toggle button styling (Amt/% labels)

## Undo Changes

- [x] Undo the compact layout redesign and restore previous version

## 6. Consistent Design System

- [x] 6.1 Apply PortfolioAssetsSection styling to WithdrawalStrategySection
- [x] 6.2 Use consistent border-left color (purple for withdrawal, blue for portfolio)
- [x] 6.3 Match padding and font sizes across sections
- [x] 6.4 Update custom toggle button styling with purple theme
- [x] 6.5 Remove native Switch component in favor of custom buttons

## 7. UI Design Consistency Across All Sections

- [x] 7.1 Apply PersonalInformationSection styling to IncomeSourcesSection
- [x] 7.2 Use gradient accent bars with section-specific colors (emerald/teal/cyan for income)
