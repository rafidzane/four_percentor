## Why

The current retirement calculator has a "single_year" simulation mode that allows users to simulate retirement using a specific historical year (e.g., 1929 for the Great Depression, 2008 for the financial crisis). However, the UI does not expose the `historical_year` input field when this mode is selected.

Users cannot test their retirement plan against specific historical market events without directly modifying the form data.

## What Changes

- Add a dropdown or number input for selecting historical year when simulation mode is set to "single_year"
- Display relevant historical context (e.g., "1929 - Stock Market Crash", "2008 - Financial Crisis")
- Validate selected year is within available historical range (1871-2025)

## Capabilities

### New Capabilities
- `retirement-historical-year-selection`: Allows users to select a specific historical year for retirement simulation

### Modified Capabilities
None

## Impact

- **Frontend**: Add conditional historical year input when "single_year" simulation mode is selected
- **Backend**: Already supports this field via `HistoricalYearInput` model - no changes needed
