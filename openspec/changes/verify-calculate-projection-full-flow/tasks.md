## 1. Test Infrastructure Setup

- [ ] 1.1 Install React Testing Library and user-event packages if not present
- [ ] 1.2 Install Mock Service Worker (MSW) for API mocking
- [ ] 1.3 Configure Jest/Vitest test environment with DOM support

## 2. Create Test Fixtures

- [ ] 2.1 Create valid form data fixture matching `FormData` interface
- [ ] 2.2 Create mock `RetirementResponse` fixture with sample data
- [ ] 2.3 Create error response fixtures for network and API errors

## 3. Write Integration Tests

- [ ] 3.1 Test: Calculate Projection button click triggers calculation
- [ ] 3.2 Test: Loading state shows spinner during calculation
- [ ] 3.3 Test: API endpoint URL and method are correct (POST /fourpercent/api/v4/retirement)
- [ ] 3.4 Test: Request body contains cleaned form data (no undefined fields)

## 4. Verify Results Display

- [ ] 4.1 Test: Portfolio balance chart receives updated data after successful response
- [ ] 4.2 Test: Income vs expenses chart updates with new lines
- [ ] 4.3 Test: Success rate and numerical results display correctly

## 5. Error Handling Tests

- [ ] 5.1 Test: Network failure shows user-friendly error message
- [ ] 5.2 Test: API error response displays specific error detail
- [ ] 5.3 Test: Retry button resets error state and allows re-calculation

## 6. Edge Cases

- [ ] 6.1 Test: Form with minimal valid data completes calculation
- [ ] 6.2 Test: Multiple rapid clicks show loading state correctly
- [ ] 6.3 Test: Invalid numeric values show validation errors before API call
