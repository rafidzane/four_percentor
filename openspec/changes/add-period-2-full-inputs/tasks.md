## 1. Frontend - Form State Updates

- [x] 1.1 Verify RetirementForm.tsx defaultValues include period_2 fields with sensible defaults
- [x] 1.2 Add TypeScript types for Period 2 form data if not already present
- [x] 1.3 Ensure two_period_mode checkbox controls Period 2 section visibility

## 2. Frontend - UI Implementation

- [x] 2.1 Update WithdrawalStrategySection.tsx to display complete Period 2 input section
- [x] 2.2 Add Start Age input field for Period 2 (match Period 1 styling)
- [x] 2.3 Add End Age input field for Period 2 with validation
- [x] 2.4 Implement Type toggle (Amount/Percentage) using same pattern as Period 1
- [x] 2.5 Add Value input that conditionally shows amount or percentage field based on type selection

## 3. Frontend - Validation

- [x] 3.1 Verify all Period 2 fields have proper RHF validation rules
- [x] 3.2 Add cross-field validation: period_2_end_age must be greater than period_2_start_age
- [ ] 3.3 Test form submission with various Period 2 configurations

## 4. Testing

- [ ] 4.1 Test single-period mode (two_period_mode = false) hides Period 2 section
- [ ] 4.2 Test two-period mode displays Period 2 inputs correctly
- [ ] 4.3 Test switching between Amount and Percentage types preserves form state
- [ ] 4.4 Verify error messages display properly for invalid Period 2 values

## 5. Backend Verification (if needed)

- [x] 5.1 Confirm SpendingStrategyInput model accepts all period_2_* fields
- [ ] 5.2 Test calculate_projection endpoint with complete Period 2 data
- [ ] 5.3 Verify simulation output correctly processes Period 2 withdrawal strategy
