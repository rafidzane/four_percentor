## Why

The retirement API currently fails with validation errors when users don't provide values for optional fields. Specifically, the error shows that `real_estate.total_property_value` is required but missing, and rental property fields (`net_annual_income`, `until_age`) receive `None` values instead of proper defaults. This prevents users from completing calculations when they haven't filled in all optional sections, causing 422 Unprocessable Entity errors.

## What Changes

- Make all optional fields in retirement API models have sensible default values
- Handle None values gracefully in calculation logic
- Ensure backward compatibility with existing valid inputs
- Improve frontend-to-backend data handling consistency

## Capabilities

### New Capabilities
- `default-field-values`: Defines how optional fields should be defaulted when not provided
- `null-value-handling`: Specifies graceful handling of None/null values in calculations

### Modified Capabilities
- `retirement-calculation-api`: The API now properly handles missing optional data with defaults instead of validation errors

## Impact

- Backend models in `/backend/fourpercent/models/` will be updated to provide default values for optional fields
- Calculation logic in `/backend/fourpercent/calculation/` will handle None values gracefully
- API endpoints at `/fourpercent/api/v4/retirement` will no longer return 422 errors for incomplete optional data
- Frontend forms can send partial data without causing validation failures