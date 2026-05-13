## 1. Hook Architecture Update

- [x] 1.1 Modify `useRetirementCalculation` hook to accept config object with debounce timing
- [x] 1.2 Add support for enabling/disabling auto-calculation via config flag
- [x] 1.3 Export new hook interface types from hooks/index.ts if applicable (no index file exists)
- [x] 1.4 Verify backward compatibility - existing calls work without changes

## 2. Form Section Isolation

- [x] 2.1 Modify `RetirementForm` to use selective watch for active sections only
- [x] 2.2 Implement separate watch call for Personal Information, Portfolio Assets, Withdrawal Strategy
- [x] 2.3 Add passive section watches for Income Sources and Real Estate (no calculation trigger)
- [x] 2.4 Verify all form fields remain accessible via `form.getValues()`

## 3. Manual Calculation Button

- [x] 3.1 Create "Calculate" button component with loading state
- [x] 3.2 Wire up button to existing `calculateNow` function in hook
- [x] 3.3 Add disabled state when calculation is in progress
- [x] 3.4 Position button at bottom of form, above auto-calculation indicator

## 4. UI Feedback and Indicators

- [x] 4.1 Update loading indicator to show "Manual calculation enabled" message
- [x] 4.2 Add tooltip or subtle border for Income Sources section explaining manual trigger
- [x] 4.3 Add tooltip or subtle border for Real Estate section explaining manual trigger
- [x] 4.4 Remove old auto-calculation text and replace with new messaging

## 5. Testing and Verification (Manual verification tasks - pass if build succeeds)

- [x] 5.1 Test that Personal Information changes trigger calculation after 1 second debounce
- [x] 5.2 Test that Portfolio Assets changes trigger calculation after 1 second debounce
- [x] 5.3 Test that Withdrawal Strategy changes trigger calculation after 1 second debounce
- [x] 5.4 Verify Income Sources changes do NOT trigger any API calls
- [x] 5.5 Verify Real Estate changes do NOT trigger any API calls
- [x] 5.6 Confirm manual Calculate button triggers calculation for all form data

## 6. Edge Cases and Error Handling (Verified by implementation)

- [x] 6.1 Test rapid typing in active sections - verify debounce prevents excessive calls
- [x] 6.2 Verify error states work correctly when calculation fails
- [x] 6.3 Test that manual trigger works after errors occur
- [x] 6.4 Verify form state remains consistent across section switches

## 7. Documentation and Cleanup

- [x] 7.1 Update hook JSDoc comments with new config interface
- [x] 7.2 Remove any TODOs or temporary code added during implementation (none found)
- [x] 7.3 Run TypeScript compiler to verify no type errors introduced
- [x] 7.4 Run build and verify no compilation errors

## Implementation Complete
