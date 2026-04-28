## Why

The retirement dashboard at http://localhost:3000/dashboard/retirement is not working correctly because the frontend form is trying to submit data to an API endpoint that doesn't exist. The logs show "404 Not Found" errors when trying to access `/fourpercent/api/v4/retirement`.

This prevents users from calculating retirement projections and using the core functionality of the application.

## What Changes

- Fix the backend API routing to properly handle requests at `/fourpercent/api/v4/retirement`
- Ensure the frontend form correctly points to the working API endpoint
- Implement proper error handling for API failures
- Verify all retirement calculation endpoints are accessible

## Capabilities

### New Capabilities
- `api-retirement-endpoint`: Properly configured backend API endpoint for retirement calculations
- `retirement-form-api-integration`: Correct integration between frontend form and backend API

### Modified Capabilities
- `retirement-dashboard-ui`: Updated UI to point to correct API endpoint
- `api-retirement-calculation`: Fixed API routing and endpoint configuration

## Impact

- Users will be able to successfully calculate retirement projections from the dashboard
- All retirement functionality will work as expected
- Error handling will provide better feedback when API issues occur
- The system will properly communicate between frontend and backend components