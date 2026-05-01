## Why

The retirement calculator is returning errors when users attempt to calculate their retirement projections. Specifically, when users click "Calculate", they receive a 422 Unprocessable Entity error from the API endpoint `/fourpercent/api/v4/retirement`. This prevents users from generating retirement plans and makes the application unusable.

Based on the logs provided, the error occurs during POST requests to the retirement endpoint with the following HTTP status codes:
- OPTIONS /fourpercent/api/v4/retirement HTTP/1.1" 200 OK
- POST /fourpercent/api/v4/retirement HTTP/1.1" 422 Unprocessable Entity

This suggests that while CORS preflight is working correctly, the actual calculation endpoint is rejecting input data due to validation errors.

## What Changes

- Fix validation issues in the retirement API endpoint
- Ensure proper error handling and informative error messages for invalid inputs
- Verify the endpoint properly accepts all required retirement planning parameters
- Test with sample retirement inputs to confirm calculations work correctly

## Capabilities

### New Capabilities
- `retirement-calculation-validation`: Improved validation logic for retirement input data
- `retirement-api-error-handling`: Better error handling and user feedback for API errors

### Modified Capabilities
- `retirement-planning-inputs`: Updated to ensure all required parameters are properly validated and accepted

## Impact

- Backend: Fix validation issues in the retirement calculation endpoint at `/fourpercent/api/v4/retirement`
- Frontend: Will need to update error handling to display more meaningful messages to users
- API: Improved error responses that help users understand what input is invalid