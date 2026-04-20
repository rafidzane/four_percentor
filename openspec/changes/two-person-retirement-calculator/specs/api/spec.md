## ADDED Requirements

### Requirement: API endpoint for two-person calculations
The system SHALL provide a new API endpoint at `/fourpercent/api/v3/retirement/calculate` that accepts dual-person inputs.

#### Scenario: Valid dual-person request
- **WHEN** client sends POST request with husband and spouse parameters
- **THEN** system returns valid retirement projection with combined metrics

#### Scenario: Invalid input handling
- **WHEN** client sends malformed or invalid data
- **THEN** system returns 422 Unprocessable Entity with specific field errors

### Requirement: Dual-person input schema
The API SHALL accept the following request structure:

```json
{
  "husband": {
    "current_age": 35,
    "retirement_age": 62,
    "liquid_assets": 100000,
    "illiquid_assets": 150000,
    "monthly_contribution": 1500,
    "annual_return_rate": 0.07,
    "social_security_age": 62,
    "expected_lifespan": 90
  },
  "spouse": {
    "current_age": 33,
    "retirement_age": 67,
    "liquid_assets": 80000,
    "illiquid_assets": 120000,
    "monthly_contribution": 1200,
    "annual_return_rate": 0.07,
    "social_security_age": 67,
    "expected_lifespan": 92
  }
}
```

#### Scenario: Complete input validation
- **WHEN** all husband and spouse fields are present and valid
- **THEN** system processes calculation successfully

#### Scenario: Missing required field
- **WHEN** either person is missing a required field
- **THEN** system returns error indicating which field and person

### Requirement: Combined output projection
The API SHALL return aggregated household metrics:

```json
{
  "husband_projection": { ...individual husband results... },
  "spouse_projection": { ...individual spouse results... },
  "household_projection": {
    "years_to_retirement": 28,
    "total_liquid_savings_at_retirement": 1500000,
    "total_net_worth_at_retirement": 2000000,
    "monthly_income_at_retirement": 8500,
    "combined_social_security_benefit": 4200,
    "safe_withdrawal_amount": 60000
  }
}
```

#### Scenario: Full projection response
- **WHEN** calculation succeeds
- **THEN** response includes both individual projections AND combined household metrics

### Requirement: Backward compatibility
Existing v1 and v2 endpoints SHALL remain unchanged and continue to support single-person calculations.

#### Scenario: Existing client calls
- **WHEN** legacy client calls /fourpercent/api/v2/deep_retirement/calculate
- **THEN** system responds with original single-person format

## Modified Requirements

### Requirement: API versioning strategy
**MODIFIED**: API now supports v1, v2 (existing), and v3 (dual-person)

#### Scenario: Version selection
- **WHEN** client calls /fourpercent/api/v3/retirement/calculate
- **THEN** system uses dual-person calculation logic
