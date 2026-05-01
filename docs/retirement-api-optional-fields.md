# Retirement API - Optional Fields Documentation

## Handling Optional Fields

The retirement API now gracefully handles optional fields that may be missing or contain `null` values from the frontend. This prevents 422 Unprocessable Entity errors when users don't fill out all optional sections.

### Rental Properties (`income_streams.rental_properties`)

When sending rental property data, you can safely omit or set fields to `null`:

```json
{
  "income_streams": {
    "rental_properties": [
      {
        "property_name": "Vacation Home",
        "net_annual_income": null,  // Can be null
        "annual_growth_pct": 2.0,
        "until_age": null           // Can be null
      }
    ]
  }
}
```

When these fields are `null`, they will be handled gracefully and skipped in calculations.

### Real Estate (`real_estate`)

The real estate section is now optional and defaults to sensible values:

```json
{
  "real_estate": {
    "total_property_value": 0.0,        // Default value when not provided
    "total_outstanding_mortgages": 0.0, // Default value when not provided
    "annual_appreciation_pct": 3.0,     // Default value when not provided
    "include_in_net_worth": true,       // Default value when not provided
    "model_property_sale": false        // Default value when not provided
  }
}
```

When the `real_estate` section is omitted entirely from the request, it will be handled gracefully as `null`.

## Backward Compatibility

All existing valid inputs continue to work exactly as before. This change only improves robustness when optional fields are missing or contain null values.