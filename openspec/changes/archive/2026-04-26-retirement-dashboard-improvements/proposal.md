## Why

The retirement dashboard at http://localhost:3000/dashboard/retirement has several issues that prevent users from effectively using the retirement calculator:

1. The frontend form is not properly integrated with the backend API - the current test script shows an outdated endpoint path
2. There are duplicate sections in the RetirementForm component (Contributions section appears twice)
3. The backend retirement calculation logic needs to be updated to match the frontend form structure
4. The UI doesn't properly display results after calculation

## What Changes

- Fix the retirement API endpoint URL to point to the correct path (`/fourpercent/api/v4/retirement`)
- Remove duplicate sections in the RetirementForm component (the Contributions section was duplicated)
- Update backend calculation logic to match the comprehensive input structure expected by the frontend
- Ensure the results display properly after calculation
- Implement proper error handling for API calls

## Capabilities

### New Capabilities
- `retirement-calculator`: Full retirement planning calculator with comprehensive inputs and projections
- `api-retirement-calculation`: Backend API endpoint for retirement calculations

### Modified Capabilities
- `retirement-dashboard-ui`: Updated UI components to properly integrate with backend API
- `api-retirement-endpoint`: Updated API endpoint to use the correct path and handle full input structure

## Impact

- The frontend form will now properly communicate with the backend at the correct API endpoint
- Users will be able to see calculated results from retirement projections
- Backend calculation engine will properly process all inputs from the frontend form
- All retirement dashboard functionality will work as expected, providing accurate retirement planning tools