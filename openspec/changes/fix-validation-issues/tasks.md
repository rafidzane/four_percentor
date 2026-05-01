## 1. Model Updates

- [x] 1.1 Update RentalPropertyInput model to make net_annual_income and until_age optional
- [x] 1.2 Update RealEstateInput model to ensure proper handling of missing fields
- [x] 1.3 Update calculation logic to handle None values gracefully

## 2. Implementation

- [x] 2.1 Implement the changes to income_streams.py model
- [x] 2.2 Implement the changes to real_estate.py model if needed
- [x] 2.3 Update retirement_v4.py calculation logic to handle None values properly

## 3. Testing and Validation

- [x] 3.1 Create test cases that simulate frontend behavior with None values
- [x] 3.2 Verify existing valid inputs still work correctly
- [x] 3.3 Test edge cases like completely empty optional sections

## 4. Documentation and Finalization

- [x] 4.1 Update API documentation to reflect the changes
- [x] 4.2 Verify all changes align with project specifications
- [x] 4.3 Confirm fix resolves the validation issues