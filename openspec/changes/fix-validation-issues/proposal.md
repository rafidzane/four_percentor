# Fix Validation Issues in Retirement API

## Problem Statement

The retirement calculation API endpoint (`/fourpercent/api/v4/retirement`) is returning 422 Unprocessable Entity errors when users click "Calculate". The error occurs due to validation failures in the input data models, specifically:

1. `net_annual_income` and `until_age` fields in rental properties are receiving `None` values instead of numbers
2. `total_property_value` field in real estate section is missing (required field)

## Root Cause Analysis

Based on the error logs, the frontend sends incomplete data where:
- Optional form sections (like rental properties) are sent as objects with `None` values for fields that weren't filled out
- The Pydantic models expect these to be actual numbers, not `None`
- Real estate section is sent without required `total_property_value` field

This happens because:
1. Frontend frameworks often send `None` for empty form fields in optional sections
2. Backend validation doesn't account for this common pattern
3. Models are defined with strict non-nullable types

## Solution Approach

The most robust solution is to make the Pydantic models more resilient by allowing nullable values where appropriate, while maintaining backward compatibility.

### Proposed Changes:
1. **Make rental property fields optional** in `RentalPropertyInput` model
2. **Add proper default handling** for real estate section fields
3. **Ensure graceful handling** of None values during calculation

## Implementation Plan

This change would involve modifying the model definitions to be more flexible with how they handle empty/None values while still maintaining data integrity for required fields.

## Risk Assessment

- **Low risk**: Changes are focused on optional fields that were already designed to be optional
- **Backward compatible**: Existing valid data will continue working
- **Maintains validation**: Required fields will still be validated appropriately