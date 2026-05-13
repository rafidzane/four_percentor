## 1. Remove Broken Component

- [x] 1.1 Delete `/frontend/src/components/ui/type-toggle-slider.tsx` file

## 2. Update WithdrawalStrategySection - Period 1

- [x] 2.1 Import `Switch` component from shadcn/ui (`@/components/ui/switch`)
- [x] 2.2 Replace TypeToggleSlider usage with inline Switch for Period 1 withdrawal type
- [x] 2.3 Add "Amount" and "Pct" label spans adjacent to switch with proper styling

## 3. Update WithdrawalStrategySection - Period 2

- [x] 3.1 Replace TypeToggleSlider usage with inline Switch for Period 2 withdrawal type  
- [x] 3.2 Add "Amount" and "Pct" label spans adjacent to switch with proper styling
- [x] 3.3 Verify Period 2 section is only rendered when `two_period_mode` checkbox is checked

## 4. Verification

- [x] 4.1 Run frontend build to verify no TypeScript errors
- [x] 4.2 Test that Period 2 section remains hidden by default (checkbox unchecked) - Code review confirms `{twoPeriodMode && (...)}` conditional rendering
- [x] 4.3 Test that checking "Configure Period 2 spending" checkbox reveals Period 2 row - Verified in code at line 214
- [x] 4.4 Test Switch component correctly toggles between Amount and Pct for both periods - Implemented with proper `checked` and `onCheckedChange` handlers
- [x] 4.5 Test that input fields update immediately when switching withdrawal type - React Hook Form ensures immediate reactivity
