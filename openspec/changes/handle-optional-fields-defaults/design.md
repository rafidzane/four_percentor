## Context

The retirement API is failing with validation errors when optional fields are not provided by the frontend. This occurs because Pydantic models require all fields to have values, but the frontend sends `None` for empty optional fields instead of omitting them completely.

The current error shows:
1. `real_estate.total_property_value` field required but missing
2. `rental_properties.net_annual_income` and `until_age` receiving `None` values

## Goals / Non-Goals

**Goals:**
- Make all optional fields in retirement API models have sensible default values when not provided
- Handle `None` values gracefully in calculation logic 
- Ensure backward compatibility with existing valid inputs
- Prevent 422 Unprocessable Entity errors when users skip optional sections
- Improve robustness of the API to handle real-world frontend behavior

**Non-Goals:**
- Changing core retirement calculation logic or formulas
- Adding new API endpoints or major features
- Modifying database schema or migrations
- Changing authentication or security mechanisms

## Decisions

1. **Model-Level Defaults**: Make optional fields in Pydantic models accept `None` values and provide sensible defaults using Pydantic's `default` parameter where appropriate.

2. **Calculation Logic Handling**: Add explicit null checking in calculation functions to skip processing of None values rather than failing validation.

3. **Field-by-Field Approach**: Address each problematic field individually rather than making sweeping changes, maintaining the existing data structure.

4. **Backward Compatibility**: Ensure all existing valid inputs continue to work exactly as before.

## Risks / Trade-offs

- [Validation Overhead] → Mitigation: Using Pydantic's built-in default handling instead of manual checks
- [Data Consistency] → Mitigation: Default values are clearly documented and follow financial best practices  
- [Performance Impact] → Mitigation: Minimal overhead from additional null checks in calculation logic