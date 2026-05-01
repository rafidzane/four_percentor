# Fix Validation Issues - Technical Design

## Context

The retirement calculation API endpoint (`/fourpercent/api/v4/retirement`) is failing with 422 errors due to validation issues. The error logs show that:
- `net_annual_income` and `until_age` in rental properties receive `None` values
- `total_property_value` field in real estate section is missing

## Root Cause

The issue stems from a mismatch between how frontend forms send data vs. how backend models expect to receive it:

1. **Frontend behavior**: Optional form sections with empty fields are sent as objects with `None` values
2. **Backend expectations**: Pydantic models require numeric values, not `None`
3. **Model definitions**: Fields like `net_annual_income: float` don't allow `None`

## Solution

### Approach
Make the retirement input models more resilient to common frontend patterns where optional fields are sent as `None` instead of being omitted.

### Specific Changes Needed

#### 1. Rental Property Input Model (`RentalPropertyInput`)
Current:
```python
class RentalPropertyInput(BaseModel):
    property_name: str = Field(description="Property name/label")
    net_annual_income: float = Field(ge=0, description="Net annual income after expenses")
    annual_growth_pct: float = Field(default=0.0, ge=0, le=100, description="Annual growth percentage")
    until_age: int = Field(description="Age at which rental income stops")
```

Fixed:
```python
class RentalPropertyInput(BaseModel):
    property_name: str = Field(description="Property name/label")
    net_annual_income: Optional[float] = Field(ge=0, description="Net annual income after expenses")
    annual_growth_pct: float = Field(default=0.0, ge=0, le=100, description="Annual growth percentage")
    until_age: Optional[int] = Field(description="Age at which rental income stops")
```

#### 2. Real Estate Input Model (`RealEstateInput`)
Current:
```python
class RealEstateInput(BaseModel):
    total_property_value: float = Field(ge=0, description="Total estimated property value")
    total_outstanding_mortgages: float = Field(default=0.0, ge=0, description="Total outstanding mortgages")
    annual_appreciation_pct: float = Field(default=3.0, ge=0, le=100, description="Annual appreciation percentage")
    include_in_net_worth: bool = Field(True, description="Include in net worth projection")
    model_property_sale: Optional[bool] = Field(False, description="Model planned property sale")
```

This one is already mostly correct - it just needs to handle the case where an empty real estate object is sent without the required field.

## Implementation Strategy

1. **Update model definitions** to make rental property fields optional
2. **Add preprocessing logic** in API layer to convert None values to defaults when needed
3. **Ensure calculation logic handles None values gracefully**
4. **Maintain backward compatibility** with existing valid inputs

## Testing Approach

1. Create test cases that simulate the exact frontend behavior (sending None values)
2. Verify that valid inputs continue to work
3. Test edge cases like completely empty optional sections
4. Ensure error messages remain helpful for truly invalid data

## Risks & Mitigation

- **Risk**: Breaking existing functionality with new validation rules
  - **Mitigation**: Comprehensive testing of both valid and invalid inputs
  
- **Risk**: Performance impact from additional processing
  - **Mitigation**: Minimal overhead in preprocessing logic

## Dependencies

This change requires:
1. Updated model definitions in `fourpercent/models/income_streams.py`
2. Updates to `fourpercent/models/real_estate.py` if needed
3. Updates to calculation logic to handle None values appropriately