## Why

Users need to input their annual contribution amounts to the retirement portfolio in order to calculate accurate retirement projections. Currently, there's no section for contributions in the Personal Information Card, which limits the accuracy of retirement planning calculations.

## What Changes

- Add a "Contributions" section to the Personal Information Card
- Include fields for "Yearly contribution" (defaulting to $10,000) and "Yearly contribution increase %" (defaulting to 3%)
- This section will be part of the retirement planning input form that users complete before running projections

## Capabilities

### New Capabilities
- `retirement-contributions`: Specification for handling user contributions data including annual contribution amounts and growth rates

### Modified Capabilities
- `retirement-planning-inputs`: Updated requirements to include contribution data in the personal information section

## Impact

- Frontend: Adds new form fields to the Personal Information Card in the retirement planning flow
- Backend: Updates the retirement planning input schema to accept contribution data
- Database: New fields will be added to user profile or retirement scenario records